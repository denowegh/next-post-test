import { authOptions } from "@/configs/auth";
import NextAuth from "next-auth";


const handler = NextAuth(authOptions);
export default handler;