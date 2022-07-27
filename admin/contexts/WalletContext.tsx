import { ethers } from "ethers";
import { createContext, useContext, useEffect, useReducer } from "react";
import useWeb3Wallet from "../hooks/useWeb3Wallet";
import { Web3Wallet } from "../libs/types";

type Action =
  | { type: "SET_WALLET"; wallet: Web3Wallet }
  | { type: "SET_NAME"; name: string };

type Dispatch = (action: Action) => void;

type State = {
  wallet: Web3Wallet | null;
};

const initialState = {
  wallet: null,
};

const WalletContext = createContext<
  { state: State; dispatch: Dispatch; web3Wallet: Web3Wallet } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_WALLET":
      return { ...state, wallet: action.wallet };
    case "SET_NAME":
      return { ...state, name: action.name };
    default:
      return state;
  }
};

const WalletProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const web3Wallet = useWeb3Wallet();

  const value = { state, dispatch, web3Wallet };
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export { WalletContext, WalletProvider };

export const useWallet = () => {
  const context = useContext(WalletContext);

  if (context === undefined) {
    throw new Error("Wallet Context error in Wallet hook");
  }

  const { dispatch, state, web3Wallet } = context;

  const setName = (name: string) => dispatch({ type: "SET_NAME", name });
  return { web3Wallet, setName };
};
