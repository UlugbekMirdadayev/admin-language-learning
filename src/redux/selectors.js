import { useSelector } from "react-redux";

export const useUser = () => useSelector(({ user }) => user);
export const useUsers = () => useSelector(({ users }) => users);
export const useLoader = () => useSelector(({ loader }) => loader);
export const useLessons = () => useSelector(({ lessons }) => lessons);
