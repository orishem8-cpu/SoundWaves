import {NextResponse} from "next/server";
export async function GET(){return NextResponse.json({status:"ok",app:"SoundWave",mode:process.env.NEXT_PUBLIC_USE_SUPABASE_AUTH==="true"?"supabase-configured":"demo"});}
