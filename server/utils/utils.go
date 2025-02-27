package utils

import (
	"encoding/base64"
	"os"
)

func PathExists(path string) bool {
	if _, err := os.Stat(path); err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}

	return true
}

func MkdirIfNotExists(path string, perm os.FileMode) error {
	if !PathExists(path) {
		err := os.MkdirAll(path, perm)
		return err
	}

	return nil
}

func B64Decode(encoded string) ([]byte, error) {
	decoded := make([]byte, base64.StdEncoding.DecodedLen(len(encoded)))
	n, err := base64.StdEncoding.Decode(decoded, []byte(encoded))
	decoded = decoded[:n]
	return decoded, err
}

func B64Encode(src []byte) string {
	return base64.StdEncoding.EncodeToString(src)
}
