# Basic demo for a websocket conn

Needs:

- node

To run:

```sh
$ make install
$ export PGCONNSTRING=postgres://......?ssl=true # do not forget to add ssl=true
$ make run-server # in one terminal
$ make run-client # in another terminal
```

Then:

- Navigate to `http://127.0.0.1:8081` for the UI.
