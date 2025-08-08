import { PartiesFacetABI } from "@/abi/PartiesFacetABI";
import { CONTRACT_ADDRESS_PREVIEWNET } from "@/constants/contracts";
import { useAppKitAccount } from "@reown/appkit/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useBlockNumber, useReadContract } from "wagmi";

enum Role {
  None = 0,
  Supplier = 1,
  Transporter = 2,
  Retailer = 3,
}

enum Rating {
  Zero = 0,
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}

interface Party {
  name: string;
  addr: string;
  role: Role;
  active: boolean;
  frozen: boolean;
  rating: Rating;
}

const useGetUser = () => {
  const { address, isConnected } = useAppKitAccount();
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const [userData, setUserData] = useState<Party | null>(null);

  const {
    data: user,
    isError,
    isSuccess,
    queryKey,
  } = useReadContract({
    address: CONTRACT_ADDRESS_PREVIEWNET as `0x${string}`,
    abi: PartiesFacetABI,
    functionName: "getParty",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && isConnected,
    },
  });

  useEffect(() => {
    if (address && isConnected) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [blockNumber, queryClient, queryKey, address, isConnected]);

  useEffect(() => {
    if (isSuccess && user) {
      const partyData = user as Party;

      // Additional validation to ensure we have valid data
      if (partyData.name && partyData.addr) {
        setUserData(partyData);
      } else {
        setUserData(null);
      }
    } else if (isError || !address || !isConnected) {
      setUserData(null);
    }
  }, [user, isSuccess, isError, address, isConnected]);

  const getRatingString = (rating: Rating): string => {
    switch (rating) {
      case Rating.Zero:
        return "0 Stars";
      case Rating.One:
        return "1 Star";
      case Rating.Two:
        return "2 Stars";
      case Rating.Three:
        return "3 Stars";
      case Rating.Four:
        return "4 Stars";
      case Rating.Five:
        return "5 Stars";
      default:
        return "No Rating";
    }
  };

  const getRatingNumber = (rating: Rating): number => {
    return rating;
  };

  // Helper function to get role as string
  const getRoleString = (role: Role): string => {
    switch (role) {
      case Role.Supplier:
        return "Supplier";
      case Role.Transporter:
        return "Transporter";
      case Role.Retailer:
        return "Retailer";
      default:
        return "None";
    }
  };

  return userData
    ? {
        ...userData,
        roleString: getRoleString(userData.role),
        ratingString: getRatingString(userData.rating),
        ratingNumber: getRatingNumber(userData.rating),
        isActive: userData.active && !userData.frozen,
        isRegistered: !!userData.name && userData.role !== Role.None,
      }
    : null;
};

export default useGetUser;
