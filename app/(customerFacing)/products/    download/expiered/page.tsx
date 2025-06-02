// app/(customerFacing)/products/download/expired/page.tsx

import Link from "next/link";

export default function DownloadExpiredPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primaryBg dark:bg-primaryBg px-4">
      <div className="max-w-lg w-full bg-secondaryBg dark:bg-secondaryBg p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-textHeading dark:text-textHeading mb-4">
          🚫 Link Expired
        </h1>
        <p className="text-textPrimary dark:text-textPrimary/70 mb-6">
          The download link is no longer valid. It may have expired, or
          your purchase wasn’t completed.
        </p>
        <Link href="/products" className="inline-block">
          <button className="bg-accentBlue text-white rounded-lg px-6 py-3 font-semibold shadow-md hover:bg-accentBlue/80 transition-colors duration-200">
            Browse Products
          </button>
        </Link>
        <p className="mt-4 text-sm text-textPrimary/60 dark:text-textPrimary/50">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
