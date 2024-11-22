import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import Logo from "@/assets/logo-orbiton.svg?react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Outlet, RouterProvider } from "react-router";
import { NavLink, createBrowserRouter } from "react-router-dom";
import { cn } from "./lib/utils";
import { LoopIcon, OpacityIcon } from "@radix-ui/react-icons";
import Pools from "./pages/Pools";
import Swap from "./pages/Swap";
import { useEffect } from "react";
import { useToast } from "./hooks/use-toast";
import useTokenStore from "./store/tokenStore";
import { useTonClient } from "./hooks/useTonClient";
import { Address } from "@ton/core";
import { Toaster } from "./components/ui/toaster";
// import { useCounterContract } from "./hooks/useCounterContract";
// import { Button } from "@/components/ui/button";
// import WebApp from "@twa-dev/sdk";
// import { useCounterContract } from "./hooks/useCounterContract";
// import { useTonConnect } from "./hooks/useTonConnect";

const ROUTES = [
  { path: "", label: "Swap", isIndex: true, icon: LoopIcon },
  { path: "pools", label: "Pools", isIndex: false, icon: OpacityIcon },
];

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <TopNavigator />,
      children: [
        {
          index: true,
          element: <Swap />,
        },
        {
          path: "pools",
          element: <Pools />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

function App() {
  const userFriendlyAddress = useTonAddress();
  
  const client = useTonClient();
  const { toast } = useToast();
  const { setBalance, fetchBalance } = useTokenStore();

  useEffect(() => {
    if (userFriendlyAddress) {
      toast({
        title: "Welcome to Orbiton Swap",
        description: `Your address: ${userFriendlyAddress}`,
        duration: 1000,
      });
      fetchBalance(userFriendlyAddress);
    }
  }, [userFriendlyAddress, toast]);

  useEffect(() => {
    async function getBalance() {
      if (!(client && userFriendlyAddress)) return;
      const balance = await client.getBalance(
        Address.parse(userFriendlyAddress)
      );
      // hardcode to ton native token
      setBalance(1, balance.toString());

      // for (const token of tokenList) {
      //   if (token.address === null) continue;
      //   console.log(token);
      //   const balance = await getJettonBalance(
      //     client,
      //     Address.parse(userFriendlyAddress),
      //     Address.parse(token.address!)
      //   );
      //   setBalance(token.id, balance.toString());
      //   // sleep 200ms
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      // }
    }

    getBalance();
  }, [client, userFriendlyAddress]);

  return (
    <RouterProvider
      future={{
        v7_startTransition: true,
      }}
      router={router}
    />
  );
}

function TopNavigator() {
  return (
    <>
      <Toaster />
      {/* Header */}
      <header className="flex justify-center px-4 z-10">
        <div className="container grid grid-cols-[1fr_3fr] items-center px-5 py-5 md:py-10 md:grid-cols-[1fr_auto_1fr]">
          {/* Logo and Brand */}
          <div className="flex items-center justify-start">
            <NavLink to="/">
              <div className="inline-flex items-center justify-between px-xs md:w-[102px]">
                <div className="relative">
                  <Logo className="w-20 h-20" />
                </div>
                <span className="text-3xl ml-4 hidden font-semibold md:inline-block">
                  Orbiton
                </span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="items-center hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-10 text-2xl">
                {ROUTES.map(({ path, label, isIndex }) => (
                  <NavigationMenuItem key={path}>
                    <NavLink
                      to={`/${isIndex ? "" : path}`}
                      end={isIndex} // Ensures "Swap" (index) matches exactly
                      className={({ isActive }) =>
                        cn(
                          "hover:bg-slate-200 hover:text-blue-800 py-3 px-8 rounded-full",
                          isActive && "text-blue-800"
                        )
                      }
                    >
                      {label}
                    </NavLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Connect Button */}
          <div className="flex justify-end text-4xl">
            <TonConnectButton style={{ fontSize: 20 }} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div>
        <Outlet />
      </div>

      {/* Footer */}
      <footer>
        <div className="fixed bottom-0 py-4 w-full md:hidden border-t-[1px] border-black">
          <NavigationMenu className="max-w-full">
            <NavigationMenuList className="gap-10 text-2xl">
              {ROUTES.map(({ path, label, isIndex, icon: Icon }) => (
                <NavigationMenuItem key={path}>
                  <NavLink
                    to={`/${isIndex ? "" : path}`}
                    end={isIndex}
                    className={({ isActive }) =>
                      cn(
                        "hover:text-blue-800 py-3 px-8 rounded-full",
                        isActive && "text-blue-800 bg-slate-200"
                      )
                    }
                  >
                    <Icon className="inline-block" /> {label}
                  </NavLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </footer>
    </>
  );
}

export default App;
