"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ReloadIcon } from "@radix-ui/react-icons"
import endpoint from "@/config/api"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import { redirect } from 'next/navigation'



export default function LoginPage() {


    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            redirect("/")
        }
    }, [])

    const { toast } = useToast()

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const LoginHandler = async () => {

        await endpoint.post("/api/token/", {
            username: username,
            password: password
        })

        .then((res) => {
            const tokens = res.data
            localStorage.setItem("access_token", tokens.access)
            toast({
                title: "Login success",
                description: "You have successfully logged into your account",
                variant: "success"
            })
            setLoading(false)
            window.location.href = "/"  
        })
        .catch((err) => {
            console.log("erro",err)
            toast({
                title: "Login failed",
                description: "Please check your username and password",
                variant: "destructive",
                action: <ToastAction altText="Try again">Try again</ToastAction>,

            })
            setLoading(false)
        })

    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <main className="flex flex-1 flex-col items-center justify-center gap-10 px-20 text-center">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    Resan, The Result Analyser
                </h1>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Login into account</CardTitle>
                        <CardDescription>
                            Enter your username below to login into account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <TooltipProvider>
                            <div className="grid grid-cols-1 gap-6">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" disabled={false}>
                                            <Icons.gitHub className="mr-2 h-4 w-4" />
                                            Github
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Under development</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="text" type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        {loading ?<Button className="w-full" disabled>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                        :
                    <Button className="w-full" onClick={() =>{setLoading(true); LoginHandler()}}>Login account</Button>
                    }
                    </CardFooter>
                </Card>
            </main>
        </div>
    )
}