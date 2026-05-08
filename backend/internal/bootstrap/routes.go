package bootstrap

import (
	handlerPkg "waybill/backend/internal/handlers"
	"waybill/backend/internal/middlewares"

	"github.com/gin-gonic/gin"
)

func setupRoutes(r *gin.Engine, handlers *Handlers) {
	api := r.Group("/api")
	v1 := api.Group("/v1")

	v1.GET("/token", handlerPkg.GetAuthToken)
	protected := v1.Group("")
	protected.Use(middlewares.LocalTokenRequired())

	setting := v1.Group("/settings")
	{
		setting.POST("", handlers.SettingHandler.CreateSettings)
		setting.GET("", handlers.SettingHandler.GetSettings)
		setting.PATCH("", handlers.SettingHandler.UpdateSettings)
	}

	drivers := protected.Group("/drivers")
	{
		drivers.POST("", handlers.DriverHandler.CreateDriver)
		drivers.GET("", handlers.DriverHandler.GetDrivers)
		drivers.GET("/:id", handlers.DriverHandler.GetDriver)
		drivers.PATCH("/:id", handlers.DriverHandler.UpdateDriver)
		drivers.DELETE("/:id", handlers.DriverHandler.DeleteDriver)
	}

	vehicles := protected.Group("/vehicles")
	{
		vehicles.POST("", handlers.VehicleHandler.CreateVehicle)
		vehicles.GET("", handlers.VehicleHandler.GetVehicles)
		vehicles.GET("/:id", handlers.VehicleHandler.GetVehicle)
		vehicles.PATCH("/:id", handlers.VehicleHandler.UpdateVehicle)
		vehicles.DELETE("/:id", handlers.VehicleHandler.DeleteVehicle)
	}

	customers := protected.Group("/customers")
	{
		customers.POST("", handlers.CustomerHandler.CreateCustomer)
		customers.GET("", handlers.CustomerHandler.GetCustomers)
		customers.GET("/:id", handlers.CustomerHandler.GetCustomer)
		customers.PATCH("/:id", handlers.CustomerHandler.UpdateCustomer)
		customers.DELETE("/:id", handlers.CustomerHandler.DeleteCustomer)
	}

	locations := protected.Group("/locations")
	{
		locations.POST("", handlers.LocationHandler.CreateLocation)
		locations.GET("", handlers.LocationHandler.GetLocations)
		locations.GET("/:id", handlers.LocationHandler.GetLocation)
		locations.PATCH("/:id", handlers.LocationHandler.UpdateLocation)
		locations.DELETE("/:id", handlers.LocationHandler.DeleteLocation)
	}

	waybills := protected.Group("/waybills")
	{
		waybills.POST("", handlers.WaybillHandler.CreateWaybill)
		waybills.GET("", handlers.WaybillHandler.GetWaybills)
		waybills.GET("/export", handlers.WaybillHandler.ExportWaybillsCSV)
		waybills.GET("/:id", handlers.WaybillHandler.GetWaybill)
		waybills.GET("/:id/export", handlers.WaybillHandler.ExportWaybillDetailCSV)
		waybills.PATCH("/:id", handlers.WaybillHandler.UpdateWaybill)
		waybills.DELETE("/:id", handlers.WaybillHandler.DeleteWaybill)

	}

	protected.GET("/analytics", handlers.AnalyticsHandler.GetAnalyticsSummary)

	v1.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})
}
