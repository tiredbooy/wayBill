package config

import "github.com/spf13/viper"

type Config struct {
	ServerPort   string
	DatabasePath string
}

func Load() *Config {
	viper.SetDefault("SERVER_PORT", "127.0.0.1:8080")
	viper.SetDefault("DATABASE_PATH", "waybill.db")

	viper.AutomaticEnv()

	return &Config{
		ServerPort:   viper.GetString("SERVER_PORT"),
		DatabasePath: viper.GetString("DATABASE_PATH"),
	}
}
