package models

type Location struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	Province   string  `json:"province"`
	IsTerminal bool    `json:"is_terminal"`
	Address    *string `json:"address"`
}

type LocationReq struct {
	Name       *string `json:"name"`
	Province   *string `json:"province"`
	IsTerminal *bool   `json:"is_terminal"`
	Address    *string `json:"address"`
}
