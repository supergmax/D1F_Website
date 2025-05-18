import CountdownTimer from "@/components/common/CountdownTimer";
import GridShape from "@/components/common/GridShape";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js Coming Soon | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Coming Soon page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function ComingSoon() {
  // Set the target date to 29 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 29);
  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen p-6 overflow-hidden z-1">
      

      <div>
        <div className="mx-auto w-full max-w-[460px] text-center">
          <Link href="/" className="inline-block mb-6">
            <Image
              className="dark:hidden"
              src="./images/logo/logo.svg"
              alt="Logo"
              width={154}
              height={32}
            />
            <Image
              className="hidden dark:block"
              src="./images/logo/logo-dark.svg"
              alt="Logo"
              width={154}
              height={32}
            />
          </Link>

          <h1 className="mb-3 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-xl">
            Coming Soon
          </h1>

          <p className="text-base text-gray-500 mb-9 dark:text-gray-400">
            this part is for now in building
          </p>

          <Link href="/" className="inline-block mb-6">
            BACK
          </Link>



          

          
        </div>


      </div>
    </div>
  );
}
