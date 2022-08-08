import { useState } from "react";
import { Switch } from "@headlessui/react";
import { useEffect } from "react";
import { Typography } from "antd";

export default function Toggle({ setTheme }) {
  const theme =
    localStorage.getItem("theme") && JSON.parse(localStorage.getItem("theme"));
  const isSystemDarkTheme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [enabled, setEnabled] = useState(theme?.isDarkTheme);
  const [isAuto, setIsAuto] = useState(theme?.isUsingSystemTheme);

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      const newTheme = {
        ...JSON.parse(localStorage.getItem("theme")),
        isDarkTheme: enabled,
      };
      localStorage.setItem("theme", JSON.stringify(newTheme));
      setTheme(newTheme);
    }
  }, [enabled]);

  function systemThemeHandle() {
    const newTheme = {
      ...JSON.parse(localStorage.getItem("theme")),
      isUsingSystemTheme: !isAuto,
    };
    setIsAuto(!isAuto);
    localStorage.setItem("theme", JSON.stringify(newTheme));
    setEnabled(isSystemDarkTheme);
  }

  return (
    <>
      <Typography.Text
        className={`${
          isAuto ? "text-indigo-500" : "text-gray-400"
        } mr-5 cursor-pointer text-lg`}
        onClick={systemThemeHandle}
      >
        Auto
      </Typography.Text>
      <Switch
        disabled={isAuto}
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? "bg-slate-600" : "bg-gray-200"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${
            enabled ? "translate-x-6 bg-white" : "translate-x-1 bg-blue-500"
          } inline-block h-4 w-4 transform rounded-full`}
        />
      </Switch>
    </>
  );
}
