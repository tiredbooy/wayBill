package bootstrap

import (
	"context"
	"fmt"
	"log"
	"waybill/backend/internal/config"
	"waybill/backend/internal/database"
	"waybill/backend/internal/handlers"
	"waybill/backend/internal/licensing"
	"waybill/backend/internal/middlewares"
	"waybill/backend/internal/repositories"
	"waybill/backend/internal/services"

	"github.com/gin-gonic/gin"
)

type App struct {
	router *gin.Engine
	cfg    *config.Config
}

type Handlers struct {
	DriverHandler    *handlers.DriverHandler
	VehicleHandler   *handlers.VehicleHandler
	CustomerHandler  *handlers.CustomerHandler
	LocationHandler  *handlers.LocationHandler
	WaybillHandler   *handlers.WaybillHandler
	SettingHandler   *handlers.SettingHandler
	AnalyticsHandler *handlers.AnalyticsHandler
}

func New(cfg *config.Config) (*App, error) {
	db, err := database.InitAndMigrate()
	if err != nil {
		return nil, fmt.Errorf("migration failed: %w", err)
	}

	if err := db.Ping(); err != nil {
		log.Println("COULDEN'T CONNECT 22", err.Error())
	}

	log.Println("migrations: OK")

	// VEHICLE SECTION
	vehicleRepo := repositories.NewVehicleRepository(db)
	vehicleSvc := services.NewVehicleService(vehicleRepo)
	vehicleH := handlers.NewVehicleHandler(vehicleSvc)

	// DRIVER SECTION
	driverRepo := repositories.NewDriverRepository(db)
	driverSvc := services.NewDriverService(driverRepo, vehicleRepo)
	driverH := handlers.NewDriverHandler(driverSvc)

	// CUSTOMER SECTION
	customerRepo := repositories.NewCustomerRepository(db)
	customerSvc := services.NewCustomerService(customerRepo)
	customerH := handlers.NewCustomerHandler(customerSvc)

	// LOCATION SECTION
	locationRepo := repositories.NewLocationRepository(db)
	locationSvc := services.NewLocationService(locationRepo)
	locationH := handlers.NewLocationHandler(locationSvc)

	// WAYBILL SECTION
	waybillrepo := repositories.NewWaybillRepository(db)
	waybillSvc := services.NewWaybillService(waybillrepo, driverRepo, vehicleRepo, locationRepo)
	waybilH := handlers.NewWaybillHandler(waybillSvc)

	// Setting Section
	settingRepo := repositories.NewSettingRepository(db)
	settingSvc := services.NewSettingService(settingRepo)
	settingH := handlers.NewSettingHandler(settingSvc)

	analyticsRepo := repositories.NewAnalyticsRepository(db)
	analyticsSvc := services.NewAnalyticsService(analyticsRepo, &settingRepo)
	analyticsH := handlers.NewAnalyticsHandler(analyticsSvc)

	ctx := context.Background()
	if err := settingSvc.InitializeSettings(ctx); err != nil {
		log.Printf("Warning: could not initialize settings: %v", err)
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	middlewares.ApplyGlobal(router, middlewares.Deps{
		// Log:           a,
		AllowedOrigins: []string{"*"},
		EnableGzip:     true,
	})

	tok, _ := licensing.GetOrCreateLocalToken()
	log.Printf("DEV local token (X-Waybill-Token): %s", tok)

	handlers := &Handlers{
		DriverHandler:    driverH,
		VehicleHandler:   vehicleH,
		CustomerHandler:  customerH,
		LocationHandler:  locationH,
		WaybillHandler:   waybilH,
		SettingHandler:   settingH,
		AnalyticsHandler: analyticsH,
	}

	setupRoutes(router, handlers)

	return &App{router: router, cfg: cfg}, nil
}

func (a *App) Run() error {
	port := a.cfg.ServerPort
	if port == "" {
		port = "8080"
	}

	if port[0] != ':' {
		port = ":" + port
	}

	log.Printf("listening on %s", port)

	return a.router.Run(port)
}
