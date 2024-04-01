"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import usePostData from "@/app/_hooks/usePostData";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function CreateAccount() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const { data, loading, error, postData } = usePostData();

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");

    if (jwt) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast(error.response.data.error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      toast("Account Created Successfully");
      sessionStorage.setItem("jwt", data?.jwt);
      sessionStorage.setItem("user", JSON.stringify(data?.user));
      router.push("/");
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    postData("/auth/local/register", user);
  };

  return (
    <article className="flex items-center h-screen justify-center">
      <article className="p-10 bg-slate-100 flex flex-col items-center max-w-lg w-full">
        <h1 className="text-5xl font-bold flex itmes-center gap-1">
          <Image src="/logo-icon.png" alt="logo icon" width={50} height={50} />
          Gemify
        </h1>
        <h2 className="text-2xl font-bold py-2">Create an Account</h2>
        <p>Enter your Email and Password to Create an account</p>
        <article className="w-full flex flex-col gap-4 mt-5">
          <Input
            placeholder="Name"
            value={user.username}
            onChange={handleChange}
            name="username"
          />
          <Input
            placeholder="Email"
            type="email"
            value={user.email}
            onChange={handleChange}
            name="email"
          />
          <Input
            placeholder="Password"
            type="password"
            value={user.password}
            onChange={handleChange}
            name="password"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex gap-3 items-center"
          >
            Create Account
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>

          <p>
            Already have a account?{" "}
            <Link href="/sign-in" className="text-primary">
              Sign in
            </Link>
          </p>
        </article>
      </article>
    </article>
  );
}

export default CreateAccount;
