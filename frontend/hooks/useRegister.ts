/* eslint-disable @typescript-eslint/no-explicit-any */
import { PartiesFacetABI } from "@/abi/PartiesFacetABI";
import { hederaPreviewnet } from "@/config/chains";
import { CONTRACT_ADDRESS_PREVIEWNET } from "@/constants/contracts";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  type BaseError,
} from "wagmi";

const useRegister = () => {
  const { isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const router = useRouter();
  const currentRoleRef = useRef<string>("");

  const { data: hash, error, writeContract } = useWriteContract();

  const register = useCallback(
    async (name: string, role: string) => {
      try {
        if (!isConnected) {
          toast.error("Please connect your wallet to register", {
            position: "top-right",
          });
          return;
        }
        if (chainId !== hederaPreviewnet.id) {
          toast.error("Please switch to Previewnet", {
            position: "top-right",
          });
          return;
        }
        if (!name) {
          toast.error("Please enter your name", {
            position: "top-right",
          });
          return;
        }
        if (!role) {
          toast.error("Please enter your role", {
            position: "top-right",
          });
          return;
        }

        let get_role_enum_by_index;

        switch (role) {
          case "Supplier":
            get_role_enum_by_index = 1;
            break;
          case "Transporter":
            get_role_enum_by_index = 2;
            break;
          case "Retailer":
            get_role_enum_by_index = 3;
            break;
          default:
            return;
        }

        currentRoleRef.current = role;

        writeContract({
          address: CONTRACT_ADDRESS_PREVIEWNET as `0x${string}`,
          abi: PartiesFacetABI,
          functionName: "registerParty",
          args: [name, get_role_enum_by_index],
        });
      } catch (error: any) {
        toast.error(error.message, { position: "top-right" });
      }
    },
    [isConnected, chainId, writeContract]
  );

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const toastId = "register";

  useEffect(() => {
    if (isConfirming) {
      toast.loading("Processing...", {
        id: toastId,
        position: "top-right",
      });
    }

    if (isConfirmed) {
      toast.success("Registration successful", {
        id: toastId,
        position: "top-right",
      });

      const role = currentRoleRef.current;
      if (role === "Transporter") {
        router.push("/transport");
      } else if (role === "Supplier" || role === "Retailer") {
        router.push("/dashboard");
      }

      // Clear the stored role after redirect
      currentRoleRef.current = "";
    }

    if (error) {
      toast.error((error as BaseError).shortMessage || error.message, {
        id: toastId,
        position: "top-right",
      });
    }
  }, [isConfirmed, error, isConfirming, router]);

  return { register };
};

export default useRegister;
