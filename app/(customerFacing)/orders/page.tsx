"use client"

import { emailOrderHistory } from "@/actions/orders"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

export default function MyOrdersPage() {
  const [data, action] = useActionState(emailOrderHistory, {})

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form action={action} className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">My Orders</CardTitle>
            <CardDescription className="text-center">
              Enter your email to receive your order history and download links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="you@example.com"
              />
              {data.error && (
                <p className="text-sm text-red-600">{data.error}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {data.message ? (
              <p className="text-sm text-green-600">{data.message}</p>
            ) : (
              <SubmitButton />
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button className="w-full" size="lg" disabled={pending} type="submit">
      {pending ? "Sending..." : "Send"}
    </Button>
  )
}
