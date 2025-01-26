"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import { useQuery } from "convex/react";
import React, { useState, useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LoaderIcon, MenuIcon, TestTube2Icon, UserIcon } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";
import { LuLogOut } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { NavLinksType } from "../constant";
import { TbSmartHome } from "react-icons/tb";
import { GrAnnounce } from "react-icons/gr";

const Navbar = () => {
  const currentUser = useQuery(api.users.getCurrentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signOut } = useAuthActions();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  const { scrollY } = useScroll();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const NavigationLinks: NavLinksType[] = [
    {
      label: "Home",
      href: "/",
      icon: TbSmartHome,
    },
    {
      label: "Profile",
      href: `/profile/${currentUser?._id}`,
      icon: UserIcon,
    },
    {
      label: "Blogs",
      href: "/blogs",
      icon: GrAnnounce,
    },
    {
      label: "Test",
      href: "/test",
      icon: TestTube2Icon,
    },
  ];

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrollPosition(latest);
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const activePathName = (path: string) => {
    return pathName === path;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const userName = currentUser ? currentUser.name : "username";
  const userEmail = currentUser ? currentUser.email : "user@gmail.com";

  const profileImage =
    "https://plus.unsplash.com/premium_photo-1664541336896-b3d5f7dec9a3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const handleLogout = () => {
    setLoading(true);
    signOut()
      .then(() => {
        toast({
          title: "Success 🎉",
          description: "You have been logged out!",
          duration: 1000,
        });
      })
      .catch((err) => {
        setError(err.message);
        toast({
          title: "Error ❌",
          description: `${error}`,
        });
      })
      .finally(() => {
        setLoading(false);
        setOpen(false);
        router.push("/");
      });
  };

  const NavigationList = ({ href, label, icon: Icon }: NavLinksType) => {
    return (
      <div
        onClick={() => handleNavigation(href)}
        className={cn(
          "flex flex-row gap-x-2 cursor-pointer items-center p-1",
          activePathName(href) ? "bg-pink-400/20 text-white" : ""
        )}
      >
        <div className="min-w-5 max-w-5 text-pink-400/50 max-h-6 min-h-6 flex justify-center items-center w-full">
          {Icon && <Icon className="size-full" />}
        </div>
        <span className="text-pink-400/50">{label}</span>
      </div>
    );
  };

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.8)" : "transparent",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
      }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "flex justify-between items-center px-4 md:px-8 lg:px-12 py-4",
        "w-full"
      )}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-x-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                className={cn(
                  "p-0 m-0 md:hidden",
                  isScrolled ? "bg-pink-500/20" : "bg-transparent"
                )}
                variant="outline"
                size="icon"
              >
                <MenuIcon className="size-20" />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-8 flex justify-center items-center flex-col w-full">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex w-full flex-col gap-y-1 justify-center items-center">
                    <div className="size-20 flex justify-center items-center rounded-full border border-pink-400">
                      <Image
                        src={profileImage}
                        className="overflow-hidden max-w-20 p-0.5 max-h-20 rounded-full object-cover"
                        alt="profile"
                        height={80}
                        width={100}
                      />
                    </div>
                    <div className="flex flex-col leading-4 text-sm">
                      <span id="user-name">{userName}</span>
                      <span id="user-email" className="text-muted-foreground">
                        {userEmail}
                      </span>
                    </div>
                  </div>
                </SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <div className="flex flex-col w-full space-y-2 py-4">
                {NavigationLinks.map((navLinks) => (
                  <NavigationList key={navLinks.label} {...navLinks} />
                ))}
              </div>

              <Button
                onClick={handleLogout}
                size="default"
                className="w-full focus-within:bg-red-400 focus:bg-pink-400/70 focus:text-black font-bold text-pink-400/70"
                variant="outline"
              >
                {loading ? (
                  <span className="flex flex-row space-x-2 w-full items-center justify-center">
                    <LoaderIcon className="animate-spin size-3.5" />
                    <span>Logging Out</span>
                  </span>
                ) : (
                  <span className="flex flex-row space-x-2 w-full items-center justify-center">
                    <LuLogOut />
                    <span>LogOut</span>
                  </span>
                )}
              </Button>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="w-full bg-pink-400/70 text-black font-bold"
                >
                  Close
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {NavigationLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                type="button"
                className={cn(
                  "text-sm font-medium transition-colors",
                  isScrolled
                    ? "text-white hover:text-pink-400"
                    : "text-white hover:text-pink-400",
                  activePathName(link.href) && "text-pink-400"
                )}
                onClick={() => handleNavigation(link.href)}
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="hidden md:flex items-center gap-x-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className={cn(
              "transition-colors",
              isScrolled
                ? "bg-pink-500/20 hover:bg-pink-500/40"
                : "bg-transparent hover:bg-pink-500/20"
            )}
          >
            {loading ? (
              <LoaderIcon className="animate-spin mr-2" />
            ) : (
              <LuLogOut className="mr-2" />
            )}
            Logout
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
