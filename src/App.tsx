import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import Logo from "@/assets/logo-orbiton.svg?react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Outlet, RouterProvider } from "react-router";
import {
  NavLink,
  createBrowserRouter,
} from "react-router-dom";
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
import AddPositionPage from "./pages/AddPosition";
import PoolDetail from "./pages/PoolDetail";
import usePoolStore from "./store/poolStore";

const ROUTES = [
  { path: "swap", label: "Swap", isIndex: true, icon: LoopIcon },
  { path: "pools", label: "Pools", isIndex: false, icon: OpacityIcon },
];

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <TopNavigator />,
      children: [
        { path: "/", index: true, element: <Swap /> },
        { path: "/pools", element: <Pools /> },
        { path: "/add-position", element: <AddPositionPage /> },
        { path: "/pool/:poolId", element: <PoolDetail /> }
      ],
    },
  ],
  {
    future: {
      // Enabling future-proof features for v7
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
  const { setBalance, fetchBalance, tokenList } = useTokenStore();
  const { fetchPoolList, poolList } = usePoolStore();

  useEffect(() => {
    console.log({ poolList });
    if (tokenList.length > 0 && poolList.length === 0) {
      fetchPoolList(tokenList);
    }
  }, [tokenList, poolList])

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
      <header className="flex justify-center px-4 z-10 border-b border-gray-200 pb-2">
        <div className="container grid grid-cols-[1fr_3fr] items-center px-5 py-2 md:py-4 md:grid-cols-[1fr_auto_1fr]">
          {/* Logo and Brand */}
          <div className="flex items-center justify-start">
            <NavLink to="/">
              <div className="inline-flex items-center justify-between px-xs md:w-[102px]">
                <div className="relative">
                  <Logo className="w-16 h-16" />
                </div>
                <span className="text-2xl ml-4 hidden font-semibold md:inline-block">
                  Orbiton
                </span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="items-center hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-10 text-xl">
                {ROUTES.map(({ path, label, isIndex }) => (
                  <NavigationMenuItem key={path}>
                    <NavLink
                      to={`/${isIndex ? "" : path}`}
                      className={({ isActive }) =>
                        cn(
                          "hover:bg-accent hover:text-primary py-2 px-6 rounded-full",
                          isActive && "text-primary bg-accent"
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
            <TonConnectButton style={{ fontSize: 16 }} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div>
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="fixed flex justify-center bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border shadow-lg md:hidden">
      <NavigationMenu>
        <NavigationMenuList className="flex justify-between items-center py-4 px-6 max-w-full">
          {ROUTES.map(({ path, label, isIndex, icon: Icon }) => (
            <NavigationMenuItem key={path} className="flex-1 mx-2 justify-center">
              <NavLink
                to={`/${isIndex ? "" : path}`}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center py-3 px-16 w-full transition-colors duration-200 hover:text-primary hover:bg-accent/50 rounded-lg",
                    isActive ? "text-primary bg-accent/30" : "text-muted-foreground"
                  )
                }
              >
                <Icon className="w-7 h-7 mb-1.5" />
                <span className="text-sm font-medium">{label}</span>
              </NavLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </footer>
    </>
  );
}

export default App;
