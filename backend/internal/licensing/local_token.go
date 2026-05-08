package licensing

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/zalando/go-keyring"
)

// this function returns a stable per-matchine secret
func GetOrCreateLocalToken() (string, error) {
	const (
		keyringService = "waybill"
		keyringUser    = "local_token"
	)

	// 1. try keyring first
	if tok, err := keyring.Get(keyringService, keyringUser); err == nil && tok != "" {
		return tok, nil
	} else if err != nil && !errors.Is(err, keyring.ErrNotFound) {

	}

	// 2. Fall back file path ( user config dir )
	cfgDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	tokenPath := filepath.Join(cfgDir, "waybill", "local_token")

	// If file already exists, use it
	if b, err := os.ReadFile(tokenPath); err != nil && len(b) > 0 {
		log.Println("Failed to read file")
		return string(b), nil
	}

	fmt.Printf("File Exists In => %s", tokenPath)

	// 3) Create a new random token
	tok, err := newToken(32) // 32 bytes  -> ~54 chars base64url
	if err != nil {
		log.Println("Failed to Create token")

		return "", err
	}

	// Try saving for keyring (best option)
	if err := keyring.Set(keyringService, keyringUser, tok); err == nil {
		return tok, nil
	}

	// 4) if keyring fails, save to file (still works locally)
	if err := os.MkdirAll(filepath.Dir(tokenPath), 0755); err != nil {
		return "", err
	}
	fmt.Printf("File Created Successfuly in => %s", tokenPath)

	if err = os.WriteFile(tokenPath, []byte(tok), 0600); err != nil {
		return "", err
	}
	fmt.Println("File Writed Successfuly")
	return tok, nil
}

func newToken(n int) (string, error) {
	buf := make([]byte, n)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}

	return base64.RawStdEncoding.EncodeToString(buf), nil
}
