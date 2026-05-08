package csv

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"time"
)
func WriteCSV(w http.ResponseWriter, filename string, headers []string, rows [][]string) error {
	w.Header().Set("Content-Type", "text/csv; charset=utf-8")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s_%s.csv\"",
		filename, time.Now().Format("20060102_150405")))

	// BOM for Excel to recognise UTF‑8 Persian characters correctly
	w.Write([]byte{0xEF, 0xBB, 0xBF})

	writer := csv.NewWriter(w)
	defer writer.Flush()

	if err := writer.Write(headers); err != nil {
		return fmt.Errorf("failed to write headers: %w", err)
	}

	for _, row := range rows {
		if err := writer.Write(row); err != nil {
			return fmt.Errorf("failed to write row: %w", err)
		}
	}

	return nil
}