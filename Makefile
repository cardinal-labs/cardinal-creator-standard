.PHONY: build

TEST_KEY := $(shell solana-keygen pubkey ./sdk/tests/test-keypairs/test-key.json)

all: build start test stop

build:
	cd program && anchor build
	cd sdk && yarn idl:generate && yarn solita

start:
	pkill solana-test-validator || true
	solana-test-validator --url https://api.mainnet-beta.solana.com \
		--clone metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s --clone PwDiXFxQsGra4sFFTT8r1QWRMd4vfumiWC1jfWNfdYT \
		--bpf-program creatS3mfzrTGjwuLD1Pa2HXJ1gmq6WXb4ssnwUbJez ./program/target/deploy/cardinal_creator_standard.so \
		--reset --quiet & echo $$! > validator.PID
	sleep 8
	solana airdrop 1000 $(TEST_KEY) --url http://localhost:8899

test:
	cd sdk && yarn test

stop:
	pkill solana-test-validator