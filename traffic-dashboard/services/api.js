export async function getForecast(){

 const res = await fetch("http://127.0.0.1:8000/forecast?days=30")

 const data = await res.json()

 return {
   history: data.history || [],
   forecast: data.forecast || []
 }

}