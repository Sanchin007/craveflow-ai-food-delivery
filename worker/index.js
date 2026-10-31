const corsHeaders = (origin, env) => ({
  "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || origin || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin"
});
const json = (data, status = 200, origin = "", env = {}) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders(origin, env), "Content-Type": "application/json; charset=utf-8" } });
const toolDefinitions = [
 {type:"function",function:{name:"search_restaurants",description:"Find restaurants by name, cuisine or preference.",parameters:{type:"object",properties:{query:{type:"string"}},required:["query"],additionalProperties:false}}},
 {type:"function",function:{name:"search_menu",description:"Find dishes in the supplied sample menu. Apply cuisine, dish, budget, vegetarian, high-protein, drink, dessert or sauce preferences.",parameters:{type:"object",properties:{query:{type:"string"},restaurant_id:{type:"string"},max_price:{type:"number"},vegetarian_only:{type:"boolean"},high_protein:{type:"boolean"},category:{type:"string",enum:["any","drink","dessert","sauce"]}},required:["query"],additionalProperties:false}}},
 {type:"function",function:{name:"add_to_cart",description:"Request adding a known menu item to the local demo bag. Only use an item id returned by search_menu.",parameters:{type:"object",properties:{item_id:{type:"string"},quantity:{type:"integer",minimum:1,maximum:10}},required:["item_id","quantity"],additionalProperties:false}}},
 {type:"function",function:{name:"remove_from_cart",description:"Remove a known item from the user's bag.",parameters:{type:"object",properties:{item_id:{type:"string"},quantity:{type:"integer",minimum:1,maximum:10}},required:["item_id","quantity"],additionalProperties:false}}},
 {type:"function",function:{name:"clear_cart",description:"Clear the demo bag only when the user explicitly asks.",parameters:{type:"object",properties:{},additionalProperties:false}}},
 {type:"function",function:{name:"set_fulfillment",description:"Choose delivery or pickup when explicitly requested.",parameters:{type:"object",properties:{value:{type:"string",enum:["delivery","pickup"]}},required:["value"],additionalProperties:false}}},
 {type:"function",function:{name:"set_payment",description:"Select a demo payment preference when explicitly requested. This does not process payment.",parameters:{type:"object",properties:{value:{type:"string",enum:["card","apple","paypal","cash"]}},required:["value"],additionalProperties:false}}},
 {type:"function",function:{name:"open_checkout",description:"Open demo checkout only when the user explicitly asks and their bag is not empty.",parameters:{type:"object",properties:{},additionalProperties:false}}}
];
const str=(v,n=500)=>typeof v==="string"?v.slice(0,n):"";
function runTool(name,args,state){
 const {restaurants,foods,cart}=state;
 if(name==="search_restaurants"){
  const q=str(args.query,120).toLowerCase();
  const matches=restaurants.filter(r=>(r.name+" "+r.cuisine+" "+(r.tags||[]).join(" ")).toLowerCase().includes(q)||q.split(/\s+/).some(w=>w.length>2&&(r.name+" "+r.cuisine+" "+(r.tags||[]).join(" ")).toLowerCase().includes(w)));
  return {restaurants:matches.slice(0,8).map(r=>({id:r.id,name:r.name,cuisine:r.cuisine,rating:r.rating,delivery_time:r.delivery_time,delivery_fee:r.delivery_fee}))};
 }
 if(name==="search_menu"){
  const q=str(args.query,120).toLowerCase();
  const matches=foods.filter(f=>(!args.restaurant_id||f.restaurant===args.restaurant_id)&&(!q||(f.name+" "+f.description+" "+(f.tags||[]).join(" ")).toLowerCase().includes(q)||q.split(/\s+/).some(w=>w.length>2&&(f.name+" "+f.description+" "+(f.tags||[]).join(" ")).toLowerCase().includes(w)))&&(args.max_price==null||f.price<=Number(args.max_price))&&(!args.vegetarian_only||f.vegetarian)&&(!args.high_protein||f.high_protein)&&(!args.category||args.category==="any"||(f.tags||[]).some(t=>t.toLowerCase()===args.category)));
  const dishes=matches.slice(0,8).map(f=>({id:f.id,name:f.name,restaurant:f.restaurant,price:f.price,description:f.description,tags:f.tags}));
  state.recommendations.push(...dishes);return {dishes};
 }
 if(name==="add_to_cart"){
  const item=foods.find(f=>f.id===args.item_id),quantity=Math.max(1,Math.min(10,Number(args.quantity)||1));
  if(!item)return {error:"Item not found. Search the sample menu first."};
  const current=cart.length?foods.find(f=>f.id===cart[0].item_id)?.restaurant:null;
  if(current&&current!==item.restaurant)return {error:"The bag contains another restaurant. Ask before switching or clearing it."};
  state.actions.push({type:"add_to_cart",item_id:item.id,quantity});return {accepted:true,item:item.name,quantity};
 }
 if(name==="remove_from_cart"){
  const item=foods.find(f=>f.id===args.item_id);
  if(!item||!cart.some(line=>line.item_id===item.id))return {error:"That item is not in the bag."};
  state.actions.push({type:"remove_from_cart",item_id:item.id,quantity:Math.max(1,Math.min(10,Number(args.quantity)||1))});return {accepted:true,item:item.name};
 }
 if(name==="clear_cart"){state.actions.push({type:"clear_cart"});return {accepted:true};}
 if(name==="set_fulfillment"&&["delivery","pickup"].includes(args.value)){state.actions.push({type:"set_fulfillment",value:args.value});return {accepted:true,value:args.value};}
 if(name==="set_payment"&&["card","apple","paypal","cash"].includes(args.value)){state.actions.push({type:"set_payment",value:args.value});return {accepted:true,value:args.value};}
 if(name==="open_checkout"){if(!cart.length&&!state.actions.some(a=>a.type==="add_to_cart"))return {error:"The bag is empty. Ask what the user wants first."};state.actions.push({type:"open_checkout"});return {accepted:true};}
 return {error:"Unsupported tool."};
}
export default { async fetch(request,env){
 const origin=request.headers.get("Origin")||"";
 if(request.method==="OPTIONS")return new Response(null,{headers:corsHeaders(origin,env)});
 if(request.method!=="POST")return json({error:"Use POST."},405,origin,env);
 if(env.ALLOWED_ORIGIN&&origin!==env.ALLOWED_ORIGIN)return json({error:"Origin not allowed."},403,origin,env);
 if(!env.OPENAI_API_KEY)return json({error:"Set OPENAI_API_KEY as a Worker secret."},503,origin,env);
 if(Number(request.headers.get("Content-Length")||0)>180000)return json({error:"Request too large."},413,origin,env);
 let body;try{body=await request.json();}catch{return json({error:"Invalid JSON."},400,origin,env);}
 const restaurants=Array.isArray(body.restaurants)?body.restaurants.slice(0,30):[];
 const foods=Array.isArray(body.foods)?body.foods.slice(0,150):[];
 const cart=Array.isArray(body.cart)?body.cart.slice(0,30):[];
 const messages=Array.isArray(body.messages)?body.messages.slice(-12):[];
 const safe=messages.filter(m=>["user","assistant"].includes(m.role)&&typeof m.content==="string").map(m=>({role:m.role,content:m.content.slice(0,1800)}));
 if(!safe.length||safe[safe.length-1].role!=="user")return json({error:"A latest user message is required."},400,origin,env);
  const latest=safe[safe.length-1].content.trim().toLowerCase().replace(/[.!?]+$/,"");
  const previousAssistant=[...safe.slice(0,-1)].reverse().find(m=>m.role==="assistant")?.content?.toLowerCase()||"";
  const declined=/^(?:no|no thanks|no thank you|not now|that's all|thats all|i'm good|im good|nothing else|all good|nope)$/.test(latest);
  const wasOfferingExtras=/anything else|round it out|drinks, sauces|sweet finishes|add one and|would you like.*(?:drink|dessert|sauce)|want to add/.test(previousAssistant);
  if(declined&&wasOfferingExtras)return json({reply:"No problem — I’ll leave your bag as it is. You can say “Checkout” whenever you’re ready.",actions:[],recommendations:[]},200,origin,env);
 const state={restaurants,foods,cart,actions:[],recommendations:[]};
 const system="You are CraveFlow, a warm, concise food-ordering concierge. Search only the supplied sample restaurant/menu catalogue using tools. Never invent dishes, prices, stock, opening hours, ratings, delivery availability or allergen safety. All catalogue data is sample data. Ask a brief question when needed. Suggest freely but never add/remove items, clear a bag, change payment/fulfilment or open checkout unless the user explicitly requested it. Never claim a real order or payment has been placed. Checkout is a local demo. Respect one-restaurant-per-bag and ask before switching. For allergies, say sample labels cannot verify ingredients or cross-contact and advise contacting the restaurant directly. Keep replies concise.";
 const history=[{role:"system",content:system},...safe];let reply="";
 try{
  for(let turn=0;turn<5;turn++){
   const upstream=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:env.OPENAI_MODEL||"gpt-4.1-mini",messages:history,tools:toolDefinitions,tool_choice:"auto",temperature:0.35,max_tokens:650})});
   if(!upstream.ok){const detail=await upstream.text();return json({error:"Model provider error.",detail:detail.slice(0,400)},502,origin,env);}
   const data=await upstream.json(),message=data.choices?.[0]?.message;if(!message)throw new Error("Empty model response");
   history.push(message);const calls=message.tool_calls||[];
   if(!calls.length){reply=str(message.content,1800);break;}
   for(const call of calls){let args={};try{args=JSON.parse(call.function.arguments||"{}");}catch{}const result=runTool(call.function.name,args,state);history.push({role:"tool",tool_call_id:call.id,content:JSON.stringify(result).slice(0,4000)});}
  }
  if(!reply)reply="I found a few options. What would you like to do next?";
  const recommendations=[...new Map(state.recommendations.map(x=>[x.id,x])).values()].slice(0,6);
  return json({reply,actions:state.actions,recommendations},200,origin,env);
 }catch(error){return json({error:"AI request failed.",detail:String(error).slice(0,300)},502,origin,env);}
}};
