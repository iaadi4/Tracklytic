import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";
import { headers } from "next/headers"
import Sidebar from "@/components/ui/sidebar";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        redirect("/login");
    }
    return (
        <div>
            <Sidebar />
        </div>
    )
}