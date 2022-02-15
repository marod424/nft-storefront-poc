# Mint an NFT

1. Create the mint account
  - TOKEN_PROGRAM_ID
  - create account instruction
  - init mint instruction

2. Create associated token account (PDA)
  - ASSOCIATED_TOKEN_PROGRAM_ID
  - derive account public key from seeds
    - payer public key
    - token program public key
    - mint account public key

3. Create metadata account (PDA)
  - METADATA_PROGRAM_ID
  - derive account public key from seeds
    - string 'metadata'
    - metadata program public key
    - mint account public key

4. Create and send transaction
