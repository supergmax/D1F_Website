import React from "react";
import { CheckLineIcon, CloseLineIcon } from "../../icons";
import TokenInModal from "../example/ModalExample/TokenInModal"

const personalPack = [
  { name: "unlock instantly", included: true },
  // { name: "500 MB Storage", included: true },
  // { name: "Unlimited Sub-Domain", included: true },
  // { name: "3 Custom Domain", included: true },
  // { name: "Free SSL Certificate", included: false },
  // { name: "Unlimited Traffic", included: false },
];
const professionalPack = [
  { name: "will be activate next month", included: true },
  // { name: "1GB Storage", included: true },
  // { name: "Unlimited Sub-Domain", included: true },
  // { name: "5 Custom Domain", included: true },
  // { name: "Free SSL Certificate", included: true },
  // { name: "Unlimited Traffic", included: false },
];
const enterprisePack = [
  { name: "will be activate next month", included: true },
  // { name: "10GB Storage", included: true },
  // { name: "Unlimited Sub-Domain", included: true },
  // { name: "10 Custom Domain", included: true },
  // { name: "Free SSL Certificate", included: true },
  // { name: "Unlimited Traffic", included: true },
];

export default function PriceTableTwoBlur() {
  return (
    <div className="grid gap-5 gird-cols-1 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {/* <!-- Pricing item --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] xl:p-8">
        <div className="flex items-start justify-between -mb-4">
          <span className="block font-semibold text-gray-800 text-theme-xl dark:text-white/90">
            Buy WithUS Token
          </span>

          <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500">
            <svg
              className="fill-current"
              width="29"
              height="28"
              viewBox="0 0 29 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.4072 8.64984C11.4072 6.77971 12.9232 5.26367 14.7934 5.26367C16.6635 5.26367 18.1795 6.77971 18.1795 8.64984C18.1795 10.52 16.6635 12.036 14.7934 12.036C12.9232 12.036 11.4072 10.52 11.4072 8.64984ZM14.7934 3.48633C11.9416 3.48633 9.62986 5.79811 9.62986 8.64984C9.62986 11.5016 11.9416 13.8133 14.7934 13.8133C17.6451 13.8133 19.9569 11.5016 19.9569 8.64984C19.9569 5.79811 17.6451 3.48633 14.7934 3.48633ZM12.8251 15.6037C8.49586 15.6037 4.98632 19.1133 4.98632 23.4425V23.847C4.98632 24.3378 5.38419 24.7357 5.87499 24.7357C6.36579 24.7357 6.76366 24.3378 6.76366 23.847V23.4425C6.76366 20.0949 9.47746 17.3811 12.8251 17.3811H16.7635C20.1111 17.3811 22.8249 20.0949 22.8249 23.4425V23.847C22.8249 24.3378 23.2228 24.7357 23.7136 24.7357C24.2044 24.7357 24.6023 24.3378 24.6023 23.847V23.4425C24.6023 19.1133 21.0927 15.6037 16.7635 15.6037H12.8251Z"
                fill=""
              />
            </svg>
          </span>
        </div>

        <div className="flex items-end">
          <h2 className="font-bold text-gray-800 text-title-md dark:text-white/90">
            min 50$ = 50WT 
          </h2>
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          add token to your balance
        </p>

        <div className="w-full h-px my-6 bg-gray-200 dark:bg-gray-800"></div>

        <ul className="mb-8 space-y-3">
          {personalPack.map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-3 text-sm  ${
                item.included
                  ? "text-gray-700 dark:text-gray-400"
                  : "text-gray-400"
              }`}
            >
              {item.included ? (
                <CheckLineIcon className="text-success-500" />
              ) : (
                <CloseLineIcon className="text-gray-400" />
              )}
              {item.name}
            </li>
          ))}
        </ul>

        
          <TokenInModal></TokenInModal>
        
        
      </div>

      {/* <!-- Pricing item --> */}
      <div className="rounded-2xl border-2 border-brand-500 bg-white p-6 dark:border-brand-500 dark:bg-white/[0.03] xl:p-8">
        <div className="flex items-start justify-between -mb-4">
          <span className="block font-semibold text-gray-800 text-theme-xl dark:text-white/90">
            With US 3k Challenge
          </span>

          <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500">
            <svg
              className="fill-current"
              width="29"
              height="28"
              viewBox="0 0 29 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.2969 3.55469C10.8245 3.55469 9.6309 4.7483 9.6309 6.2207V7.10938H6.29462C4.82222 7.10938 3.6286 8.30299 3.6286 9.77539V20.4395C3.6286 21.9119 4.82222 23.1055 6.29462 23.1055H23.4758C24.9482 23.1055 26.1419 21.9119 26.1419 20.4395V9.77539C26.1419 8.30299 24.9482 7.10938 23.4758 7.10938H19.7025V6.2207C19.7025 4.7483 18.5089 3.55469 17.0365 3.55469H12.2969ZM18.8148 8.88672C18.8145 8.88672 18.8142 8.88672 18.8138 8.88672H10.5196C10.5193 8.88672 10.5189 8.88672 10.5186 8.88672H6.29462C5.80382 8.88672 5.40595 9.28459 5.40595 9.77539V10.9666L14.5355 14.8792C14.759 14.975 15.012 14.975 15.2356 14.8792L24.3645 10.9669V9.77539C24.3645 9.28459 23.9666 8.88672 23.4758 8.88672H18.8148ZM17.9252 7.10938V6.2207C17.9252 5.7299 17.5273 5.33203 17.0365 5.33203H12.2969C11.8061 5.33203 11.4082 5.7299 11.4082 6.2207V7.10938H17.9252ZM5.40595 20.4395V12.9003L13.8353 16.5129C14.506 16.8003 15.2651 16.8003 15.9357 16.5129L24.3645 12.9006V20.4395C24.3645 20.9303 23.9666 21.3281 23.4758 21.3281H6.29462C5.80382 21.3281 5.40595 20.9303 5.40595 20.4395Z"
                fill=""
              />
            </svg>
          </span>
        </div>

        <div className="flex items-end">
          <h2 className="font-bold text-gray-800 text-title-md dark:text-white/90">
            3000 WT
          </h2>
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          unlock a new challenge
        </p>

        <div className="w-full h-px my-6 bg-white/20"></div>

        <ul className="mb-8 space-y-3">
          {professionalPack.map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-3 text-sm  ${
                item.included
                  ? "text-gray-700 dark:text-gray-400"
                  : "text-gray-400"
              }`}
            >
              {item.included ? (
                <CheckLineIcon className="text-success-500" />
              ) : (
                <CloseLineIcon className="text-gray-400" />
              )}
              {item.name}
            </li>
          ))}
        </ul>

        <button className="flex w-full items-center justify-center rounded-lg bg-brand-500 p-3.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
          GET A CHALLENGE
        </button>
      </div>

      {/* <!-- Pricing item 3 : Safety Mattress with blur + message --> */}
<div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] xl:p-8">
  {/* Overlay avec blur et message */}
  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-md">
    <span className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
      🧊 Coming soon — stay tuned!
    </span>
  </div>

  {/* Contenu visible mais désactivé */}
    <div className="pointer-events-none opacity-60">
      <div className="flex items-start justify-between -mb-4">
        <span className="block font-semibold text-gray-800 text-theme-xl dark:text-white/90">
          Safety Mattress
        </span>

        <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500">
          {/* ICON */}
          <svg
            className="fill-current"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* <!-- ton path ici --> */}
          </svg>
        </span>
      </div>

      <div className="flex items-end">
        <h2 className="font-bold text-gray-800 text-title-md dark:text-white/90">
          2500 WT
        </h2>
      </div>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Be Safer on your challenge
      </p>

      <div className="w-full h-px my-6 bg-gray-200 dark:bg-gray-800"></div>

      <ul className="mb-8 space-y-3">
        {enterprisePack.map((item, index) => (
          <li
            key={index}
            className={`flex items-center gap-3 text-sm ${
              item.included
                ? "text-gray-700 dark:text-gray-400"
                : "text-gray-400"
            }`}
          >
            {item.included ? (
              <CheckLineIcon className="text-success-500" />
            ) : (
              <CloseLineIcon className="text-gray-400" />
            )}
            {item.name}
          </li>
        ))}
      </ul>

      <button className="flex w-full items-center justify-center rounded-lg bg-gray-800 p-3.5 text-sm font-medium text-white shadow-theme-xs transition-colors dark:bg-white/10">
        Mattress for your Challenge
      </button>
    </div>
  </div>

    </div>
  );
}
