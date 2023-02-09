import { type NextPage } from "next";
import { useEffect, useState } from 'react'
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../../utils/api";

const About: NextPage = () => {

  return (
    <>
      <Head>
        <title>About Me </title>
        <meta name="description" content="Personal/Professional Website for Ike Nwosu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen">
        <div className="w-5/6 h-4/5 left-36 top-14">
          <h1 className=" text-8xl relative left-10 top-10">About me</h1>
          <p>
            I am a Software and Web Developer that is well-versed in using the latest technologies and tools to develop efficient and intuitive applications. I am a creative problem solver who is able to generate innovative solutions to a wide range of development challenges.
          </p>
        </div>
      </main>
    </>
  );
};

export default About;
