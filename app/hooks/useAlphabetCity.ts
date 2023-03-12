import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isWordHunt } from "../libs/utils";
import web3Api from "../libs/web3Api";
import useAuth from "./useAuth";

export default function useAlphabetCity() {
  const auth = useAuth();
  //word stuff - could be in its own hook
  const [word, setWord] = useState<string>("");
  const [letters, setLetters] = useState<string>("");

    const router = useRouter()

    const onWordWon = (winner: any, word: any, event: any) => {
        if (winner === auth.user.publicAddress) {
          alert(`You won the word! Congratz!`);
        }
      };

    useEffect(() => {
        const hunt = router.query.groupName;
        // To do: better reducer for different hunts
        if (isWordHunt(hunt as string)) {
          web3Api.getCurrentWord().then(setWord);
          if (auth.user && auth.user.publicAddress) {
            web3Api
              .getAccountsCurrentLetters(auth.user.publicAddress)
              .then((letters) => {
                setLetters(letters);
              });
    
            web3Api.alphabetCityContract.on("WordWon", onWordWon);
          }
        }
    
        return () => {
          if (auth.user && auth.user.publicAddress) {
            web3Api.alphabetCityContract.off("WordWon", onWordWon);
          }
        };
      }, [router, auth.user]);

    return {word, letters}
}