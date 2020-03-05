# CryptoCore scripts

Sample code that we use to document the CryptoCore API on the IOTA documentation portal.

Use this repository to try sample code and learn how to use CryptoCore with the accompanying [documentation](https://docs.iota.org/docs/iot/0.1/cryptocore/introduction/get-started).

## Getting started

To create eight zero-value transactions, do proof of work for them, and send them to a node, do the following:

1. Clone this repository

  ```bash
  git clone https://github.com/JakeSCahill/cryptocore-scripts
  ```

2. Change into the `bash-scripts` directory

  ```bash
  cd cryptocore-scripts/bash-scripts
  ```

3. Execute the `do_pow.sh` script

  ```bash
  sudo ./do-pow.sh
  ```

4. Follow the prompts

If everything went well, you should see the tail transaction hash of your bundle.

```bash
Successfully attached transactions to the Tangle
Tail transaction hash:
```

You can find your bundle on the Tangle by pasting this hash into a [Tangle explorer](https://utils.iota.org/).

## Next steps

See the [IOTA documentation portal](https://docs.iota.org/docs/iot/0.1/cryptocore/introduction/get-started) for guides on how these scripts work and how to use them.
