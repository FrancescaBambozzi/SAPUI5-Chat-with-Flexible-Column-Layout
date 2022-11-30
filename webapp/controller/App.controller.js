sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("myapp.chatapp.controller.App", {
      onInit: function () {
        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter.attachRouteMatched(this.onRouteMatched, this);
      },

      onRouteMatched: function (oEvent) {
        var sRouteName = oEvent.getParameter("name"),
          oArguments = oEvent.getParameter("arguments");

        this.currentRouteName = sRouteName;
        this.currentContact = oArguments.contact; //name of the argument in the manifest route param
      },

      onStateChanged: function (oEvent) {
        var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
          sLayout = oEvent.getParameter("layout");

        // Replace the URL with the new layout if a navigation arrow was used
        if (bIsNavigationArrow) {
          this.oRouter.navTo(
            this.currentRouteName,
            { layout: sLayout, contact: this.currentContact },
            true
          );
        }
      },

      onExit: function () {
        this.oRouter.detachRouteMatched(this.onRouteMatched, this);
      },
    });
  }
);
