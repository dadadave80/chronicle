/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductsFacetABI } from "@/abi/ProductsFacetABI";
import { hederaPreviewnet } from "@/config/chains";
import { CONTRACT_ADDRESS_PREVIEWNET } from "@/constants/contracts";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { parseUnits } from "viem";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  type BaseError,
} from "wagmi";

const useAddProduct = () => {
  const { isConnected, address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const { data: hash, error, writeContract, isPending } = useWriteContract();

  // Move the formatting function outside the callback to avoid recreation
  const formatPriceWith8Decimals = useCallback(
    (price: string | number): bigint => {
      try {
        const priceStr = price.toString();
        if (!priceStr || isNaN(Number(priceStr))) {
          throw new Error("Invalid price format");
        }
        return parseUnits(priceStr, 8);
      } catch (error) {
        console.error("Error formatting price:", error);
        throw error;
      }
    },
    []
  );

  const addProduct = useCallback(
    async (
      name: string,
      memo: string,
      price: number,
      transporterFee: number,
      supply: number
    ) => {
      try {
        console.log("=== Add Product Debug Info ===");
        console.log("isConnected:", isConnected);
        console.log("address:", address);
        console.log("chainId:", chainId);
        console.log("expectedChainId:", hederaPreviewnet.id);
        console.log("CONTRACT_ADDRESS:", CONTRACT_ADDRESS_PREVIEWNET);

        // Validation checks
        if (!isConnected) {
          toast.error("Please connect your wallet first", {
            position: "top-right",
          });
          return false;
        }

        if (!address) {
          toast.error("Wallet address not found", {
            position: "top-right",
          });
          return false;
        }

        if (chainId !== hederaPreviewnet.id) {
          toast.error(
            `Please switch to Hedera Previewnet (Chain ID: ${hederaPreviewnet.id})`,
            {
              position: "top-right",
            }
          );
          return false;
        }

        // Input validation
        if (!name?.trim()) {
          toast.error("Product name is required", {
            position: "top-right",
          });
          return false;
        }

        if (!memo?.trim()) {
          toast.error("Product description is required", {
            position: "top-right",
          });
          return false;
        }

        if (!price || price <= 0) {
          toast.error("Price must be greater than 0", {
            position: "top-right",
          });
          return false;
        }

        if (!transporterFee || transporterFee < 0) {
          toast.error("Transporter fee must be 0 or greater", {
            position: "top-right",
          });
          return false;
        }

        if (!supply || supply <= 0) {
          toast.error("Supply must be greater than 0", {
            position: "top-right",
          });
          return false;
        }

        console.log("=== Product Data ===");
        console.log("Raw inputs:", {
          name: name.trim(),
          memo: memo.trim(),
          price,
          transporterFee,
          supply,
        });

        // Format prices to 18 decimals
        const formattedPrice = formatPriceWith8Decimals(price);
        const formattedTransporterFee =
          formatPriceWith8Decimals(transporterFee);

        console.log("Formatted values:", {
          formattedPrice: formattedPrice.toString(),
          formattedTransporterFee: formattedTransporterFee.toString(),
        });

        console.log("=== Contract Call Info ===");
        console.log("Contract args:", [
          name.trim(),
          memo.trim(),
          formattedPrice,
          formattedTransporterFee,
          supply,
        ]);

        // Call the contract
        const result = writeContract({
          address: CONTRACT_ADDRESS_PREVIEWNET as `0x${string}`,
          abi: ProductsFacetABI,
          functionName: "addProduct",
          args: [
            name.trim(),
            memo.trim(),
            formattedPrice,
            formattedTransporterFee,
            supply,
          ],
        });

        console.log("writeContract called, result:", result);
        return true;
      } catch (error: any) {
        console.error("=== Add Product Error ===", error);

        let errorMessage = "Failed to add product";

        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.reason) {
          errorMessage = error.reason;
        }

        toast.error(errorMessage, {
          position: "top-right",
          duration: 5000,
        });
        return false;
      }
    },
    [isConnected, address, chainId, writeContract, formatPriceWith8Decimals]
  );

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const toastId = "add-product-toast";

  useEffect(() => {
    console.log("=== Transaction Status ===");
    console.log("hash:", hash);
    console.log("isPending:", isPending);
    console.log("isConfirming:", isConfirming);
    console.log("isConfirmed:", isConfirmed);
    console.log("error:", error);

    if (hash && isConfirming) {
      toast.loading("Processing transaction...", {
        id: toastId,
        position: "top-right",
      });
    }

    if (isConfirmed && hash) {
      toast.dismiss(toastId);
      toast.success("Product added successfully! 🎉", {
        id: toastId,
        position: "top-right",
        duration: 4000,
      });
    }

    if (error) {
      toast.dismiss(toastId);
      const errorMessage =
        (error as BaseError).shortMessage ||
        (error as BaseError).message ||
        "Transaction failed";

      toast.error(errorMessage, {
        id: toastId,
        position: "top-right",
        duration: 5000,
      });
    }
  }, [isConfirmed, error, isConfirming, hash, isPending]);

  return {
    addProduct,
  };
};

export default useAddProduct;
