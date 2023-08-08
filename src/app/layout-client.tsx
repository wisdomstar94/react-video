"use client"

import Link from "next/link";
import { useState } from "react";

export default function RootLayoutClient() {
  const [menus, setMenus] = useState([
    { name: '/test/test1', href: '/test/test1' },
    { name: '/test/test2', href: '/test/test2' },
    { name: '/test/test3', href: '/test/test3' },
    { name: '/test/test4', href: '/test/test4' },
    { name: '/test/test5', href: '/test/test5' },
  ]);

  return (
    <>
      <ul className="w-full relative flex flex-wrap gap-2">
        {
          menus.map(menu => {
            return (
              <li 
                className="inline-flex relative"
                key={menu.name}>
                <Link 
                  href={menu.href}
                  className="w-full inline-flex px-6 py-2 text-sm text-slate-700 border border-slate-400 rounded-md cursor-pointer hover:bg-slate-200">
                  { menu.name }
                </Link>
              </li>
            );
          })
        }
      </ul>
    </>
  );
}
