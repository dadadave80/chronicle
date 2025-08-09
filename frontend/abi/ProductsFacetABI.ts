export const ProductsFacetABI = [
  { inputs: [], type: "error", name: "BurnFailed" },
  { inputs: [], type: "error", name: "CreateFungibleTokenFailed" },
  { inputs: [], type: "error", name: "InvalidTokenAddress" },
  { inputs: [], type: "error", name: "MintFailed" },
  {
    inputs: [{ internalType: "address", name: "supplier", type: "address" }],
    type: "error",
    name: "NotSupplier",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "productToken",
        type: "address",
      },
    ],
    type: "error",
    name: "ProductInactive",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "productToken",
        type: "address",
      },
    ],
    type: "error",
    name: "ProductSold",
  },
  { inputs: [], type: "error", name: "SingleAssociationFailed" },
  {
    inputs: [],
    type: "error",
    name: "UpdateTokenCustomFeesFailed",
  },
  { inputs: [], type: "error", name: "UpdateTokenInfoFailed" },
  { inputs: [], type: "error", name: "UpdateTokenKeysFailed" },
  {
    inputs: [
      {
        internalType: "struct Product",
        name: "product",
        type: "tuple",
        components: [
          { internalType: "uint32", name: "id", type: "uint32" },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "memo", type: "string" },
          { internalType: "int64", name: "price", type: "int64" },
          {
            internalType: "int64",
            name: "transportFee",
            type: "int64",
          },
          {
            internalType: "int64",
            name: "totalSupply",
            type: "int64",
          },
          {
            internalType: "address",
            name: "supplier",
            type: "address",
          },
          {
            internalType: "enum ProductStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "created",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "updated",
            type: "uint40",
          },
        ],
        indexed: true,
      },
    ],
    type: "event",
    name: "ProductCreated",
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: "struct Product",
        name: "product",
        type: "tuple",
        components: [
          { internalType: "uint32", name: "id", type: "uint32" },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "memo", type: "string" },
          { internalType: "int64", name: "price", type: "int64" },
          {
            internalType: "int64",
            name: "transportFee",
            type: "int64",
          },
          {
            internalType: "int64",
            name: "totalSupply",
            type: "int64",
          },
          {
            internalType: "address",
            name: "supplier",
            type: "address",
          },
          {
            internalType: "enum ProductStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "created",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "updated",
            type: "uint40",
          },
        ],
        indexed: true,
      },
    ],
    type: "event",
    name: "ProductQuantityDecreased",
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: "struct Product",
        name: "product",
        type: "tuple",
        components: [
          { internalType: "uint32", name: "id", type: "uint32" },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "memo", type: "string" },
          { internalType: "int64", name: "price", type: "int64" },
          {
            internalType: "int64",
            name: "transportFee",
            type: "int64",
          },
          {
            internalType: "int64",
            name: "totalSupply",
            type: "int64",
          },
          {
            internalType: "address",
            name: "supplier",
            type: "address",
          },
          {
            internalType: "enum ProductStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "created",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "updated",
            type: "uint40",
          },
        ],
        indexed: true,
      },
    ],
    type: "event",
    name: "ProductQuantityIncreased",
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: "struct Product",
        name: "product",
        type: "tuple",
        components: [
          { internalType: "uint32", name: "id", type: "uint32" },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "memo", type: "string" },
          { internalType: "int64", name: "price", type: "int64" },
          {
            internalType: "int64",
            name: "transportFee",
            type: "int64",
          },
          {
            internalType: "int64",
            name: "totalSupply",
            type: "int64",
          },
          {
            internalType: "address",
            name: "supplier",
            type: "address",
          },
          {
            internalType: "enum ProductStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "created",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "updated",
            type: "uint40",
          },
        ],
        indexed: true,
      },
    ],
    type: "event",
    name: "ProductUpdated",
    anonymous: false,
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_memo", type: "string" },
      { internalType: "int64", name: "_price", type: "int64" },
      {
        internalType: "int64",
        name: "_transporterFee",
        type: "int64",
      },
      {
        internalType: "int64",
        name: "_initialSupply",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "addProduct",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      { internalType: "int64", name: "_quantity", type: "int64" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "decreaseProductQuantity",
  },
  {
    inputs: [],
    stateMutability: "view",
    type: "function",
    name: "getAllProducts",
    outputs: [
      {
        internalType: "struct Product[]",
        name: "",
        type: "tuple[]",
        components: [
          { internalType: "uint32", name: "id", type: "uint32" },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "memo", type: "string" },
          { internalType: "int64", name: "price", type: "int64" },
          {
            internalType: "int64",
            name: "transportFee",
            type: "int64",
          },
          {
            internalType: "int64",
            name: "totalSupply",
            type: "int64",
          },
          {
            internalType: "address",
            name: "supplier",
            type: "address",
          },
          {
            internalType: "enum ProductStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "created",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "updated",
            type: "uint40",
          },
        ],
      },
    ],
  },
  {
    inputs: [],
    stateMutability: "view",
    type: "function",
    name: "getAllProductsTokenAddress",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    name: "getProductByTokenAddress",
    outputs: [
      {
        internalType: "struct Product",
        name: "",
        type: "tuple",
        components: [
          { internalType: "uint32", name: "id", type: "uint32" },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "memo", type: "string" },
          { internalType: "int64", name: "price", type: "int64" },
          {
            internalType: "int64",
            name: "transportFee",
            type: "int64",
          },
          {
            internalType: "int64",
            name: "totalSupply",
            type: "int64",
          },
          {
            internalType: "address",
            name: "supplier",
            type: "address",
          },
          {
            internalType: "enum ProductStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "created",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "updated",
            type: "uint40",
          },
        ],
      },
    ],
  },
  {
    inputs: [
      { internalType: "uint8", name: "_start", type: "uint8" },
      { internalType: "uint8", name: "_end", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
    name: "getProductsByRange",
    outputs: [
      {
        internalType: "struct Product[]",
        name: "",
        type: "tuple[]",
        components: [
          { internalType: "uint32", name: "id", type: "uint32" },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "memo", type: "string" },
          { internalType: "int64", name: "price", type: "int64" },
          {
            internalType: "int64",
            name: "transportFee",
            type: "int64",
          },
          {
            internalType: "int64",
            name: "totalSupply",
            type: "int64",
          },
          {
            internalType: "address",
            name: "supplier",
            type: "address",
          },
          {
            internalType: "enum ProductStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "created",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "updated",
            type: "uint40",
          },
        ],
      },
    ],
  },
  {
    inputs: [],
    stateMutability: "view",
    type: "function",
    name: "getProductsCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_supplier",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    name: "getSupplierProductTokenAddresses",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_supplier",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    name: "getSupplierProducts",
    outputs: [
      {
        internalType: "struct Product[]",
        name: "",
        type: "tuple[]",
        components: [
          { internalType: "uint32", name: "id", type: "uint32" },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "memo", type: "string" },
          { internalType: "int64", name: "price", type: "int64" },
          {
            internalType: "int64",
            name: "transportFee",
            type: "int64",
          },
          {
            internalType: "int64",
            name: "totalSupply",
            type: "int64",
          },
          {
            internalType: "address",
            name: "supplier",
            type: "address",
          },
          {
            internalType: "enum ProductStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "created",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "updated",
            type: "uint40",
          },
        ],
      },
    ],
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      { internalType: "int64", name: "_quantity", type: "int64" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "increaseProductQuantity",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_memo", type: "string" },
      { internalType: "int64", name: "_price", type: "int64" },
      {
        internalType: "int64",
        name: "_transporterFee",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "updateProduct",
  },
];
