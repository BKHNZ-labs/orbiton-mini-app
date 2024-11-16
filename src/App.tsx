import { TonConnectButton } from "@tonconnect/ui-react";
import Logo from "@/assets/logo-orbiton.svg?react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Outlet, RouterProvider } from "react-router";
import { NavLink, createBrowserRouter } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
// import { Button } from "@/components/ui/button";
// import WebApp from "@twa-dev/sdk";
// import { useCounterContract } from "./hooks/useCounterContract";
// import { useTonConnect } from "./hooks/useTonConnect";

const router = createBrowserRouter(
  [
    {
      path: "/orbiton-mini-app/",
      element: <TopNavigator />,
      children: [
        {
          index: true,
          path: "swaps",
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
  // const { address, value, sendIncrement, contract_balance } =
  //   useCounterContract();

  // const { connected } = useTonConnect();

  // const showAlert = () => {
  //   WebApp.showAlert("Hey there!");
  // };

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
      <header className="flex justify-center px-4 z-10">
        <div className="container grid grid-cols-[1fr_3fr] items-center px-5 py-10 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center justify-start">
            <NavLink to="/orbiton-mini-app/">
              <div className="inline-flex items-center  justify-between px-xs md:w-[102px]">
                <div className="relative">
                  <Logo className="w-20 h-20" />
                </div>
                <span className="text-3xl ml-4 m-auto hidden font-semibold md:inline-block">
                  Orbiton
                </span>
              </div>
            </NavLink>
          </div>
          <div className="items-center hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-10 text-2xl">
                <NavigationMenuItem>
                  <NavLink
                    to="/orbiton-mini-app/swaps"
                    className={({ isActive }) => {
                      return cn(
                        "hover:bg-slate-200 hover:text-blue-800 py-3 px-8 rounded-full",
                        [isActive ? "text-blue-800" : ""]
                      );
                    }}
                  >
                    Swap
                  </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavLink
                    to="/orbiton-mini-app/pools"
                    className={({ isActive }) => {
                      return cn(
                        "hover:bg-slate-200 hover:text-blue-800 py-3 px-8 rounded-full",
                        [isActive ? "text-blue-800" : ""]
                      );
                    }}
                  >
                    Pools
                  </NavLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex justify-end text-4xl">
            <TonConnectButton style={{ fontSize: 20 }} />
          </div>
        </div>
      </header>
      <div className="container pb-[12px] pt-4 flex flex-1 justify-center duration-[0.2s] transition-[background-color] ease-[ease-in-out] z-[1]">
        <Outlet />
      </div>
      <footer>
        <div className="fixed bottom-8 w-full md:hidden">
          <NavigationMenu className="max-w">
            <NavigationMenuList className="gap-10 text-2xl">
              <NavigationMenuItem>
                <NavLink
                  to="/orbiton-mini-app/swaps"
                  className={({ isActive }) => {
                    return cn(
                      "hover:bg-slate-200 hover:text-blue-800 py-3 px-8 rounded-full",
                      [isActive ? "text-blue-800" : ""]
                    );
                  }}
                >
                  Swap
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  to="/orbiton-mini-app/pools"
                  className={({ isActive }) => {
                    return cn(
                      "hover:bg-slate-200 hover:text-blue-800 py-3 px-8 rounded-full",
                      [isActive ? "text-blue-800" : ""]
                    );
                  }}
                >
                  Pools
                </NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </footer>
    </>
  );
}

function Swap() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Swap Page</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}

function Pools() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Pools Page</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}

export default App;
