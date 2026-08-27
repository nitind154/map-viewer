import { useState } from "react";

// Optional: If you're loading secure web maps
// import { configureOAuth } from "./auth/configureOAuth";
// configureOAuth({
//   // Default portalUrl is ArcGIS Online
//   // Only set if using other portals
//   portalUrl: "YOUR_PORTAL_URL",
//   appId: "YOUR_APP_ID",
// });

// Individual imports for each Map, Chart and Calcite component
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-locate";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/charts-components/components/arcgis-chart";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";
import "@esri/calcite-components/components/calcite-shell-panel";
import "@esri/calcite-components/components/calcite-action";
import "@esri/calcite-components/components/calcite-action-bar";

// Import modules and types from the SDK's core API
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol.js";
import type WebMap from "@arcgis/core/WebMap.js";
import type MapView from "@arcgis/core/views/MapView.js";

export function App(): React.JSX.Element {
  const [navHeading, setNavHeading] = useState("");
  const [navDescription, setNavDescription] = useState("");

  const [panelOpen, setPanelOpen] = useState(true);

  const handleViewReady = (event: CustomEvent): void => {
    const viewElement = event.target as HTMLArcgisMapElement;
    const view = viewElement.view as MapView;

    // Use metadata from the Web Map to populate the header
    const map = viewElement.map as WebMap;
    const portalItem = map.portalItem;
    const title = portalItem?.title ? portalItem.title : "A web map";
    const description = portalItem?.description
      ? portalItem.description
      : "ArcGIS Maps SDK for JavaScript template";

    view.on("click", (clickEvent) => {
      console.log("Click Details", clickEvent);
      if (clickEvent.button == 0) {
        // Pop up only on Left click
        const { latitude, longitude } = clickEvent.mapPoint;
        // Popup Template
        const popupTemp = {
          location: clickEvent.mapPoint,
          title: "Clicked location",
          content: `Latitude: ${latitude?.toFixed(5)}<br>Longitude: ${longitude?.toFixed(5)}`,
        };
        if (view.popup?.visible) {
          view.closePopup();
        } else {
          view.openPopup(popupTemp);
        }
      } else {
        alert("Right Click");
      }
    });

    setNavHeading(title);
    setNavDescription(description);

    // Define a point geometry
    const point = new Point({
      longitude: -98.38,
      latitude: 38.34,
    });

    // Create an outline for the marker symbol
    const outline = new SimpleLineSymbol({
      color: "white",
      width: 2,
    });

    // Create a symbol for drawing the point
    const symbol = new SimpleMarkerSymbol({
      style: "triangle",
      size: 20,
      color: "red",
      outline,
    });

    // Create a graphic and add the geometry and symbol to it
    const pointGraphic = new Graphic({
      geometry: point,
      symbol,
    });

    // Add a graphic to demonstrate custom visualizations beyond Web Map content
    viewElement.graphics.add(pointGraphic);
  };

  return (
    // The Shell component is used as a layout for this template
    <calcite-shell>
      <calcite-action
        slot="header-actions-start"
        text="Menu"
        icon="hamburger"
        text-enabled
        onClick={() => setPanelOpen((prev) => !prev)}
      ></calcite-action>

      {panelOpen && (
        <calcite-shell-panel
          width="m"
          slot="panel-start"
          style={
            {
              "--calcite-shell-panel-width": "2px",
              "--calcite-shell-panel-min-width": "2px",
              "--calcite-shell-max-width": "2px",
            } as React.CSSProperties
          }
        >
          <calcite-action-bar
            slot="action-bar"
            expandPosition="start"
            expanded={false}
          >
            <calcite-action
              text="Add"
              icon="plus"
              text-enabled
            ></calcite-action>
            <calcite-action
              text="Save"
              icon="save"
              text-enable
            ></calcite-action>
            <calcite-action
              text="Undo"
              icon="undo"
              text-enabled
            ></calcite-action>
            <calcite-action
              text="Redo"
              icon="redo"
              text-enabled
            ></calcite-action>
          </calcite-action-bar>

          {/* <calcite-panel heading="Panel">
            <p style={{ padding:"12px"}}>Panel content goes here.</p>
          </calcite-panel> */}
        </calcite-shell-panel>
      )}
      {/* The Map component fits to the size of the parent element  */}
      {/* The basemap, extent, zoom and more are provided by the Web Map (item-id) */}
      {/* Note: popup-component-enabled enables the Popup component (beta). See https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-map/#popupComponentEnabled for details. */}

      <arcgis-map
        basemap={"streets"}
        center={"79.3366,26.1451"}
        zoom={12}
        popup-component-enabled
        onarcgisViewReadyChange={handleViewReady}
      >
        <arcgis-zoom slot="bottom-right" />
        <arcgis-search slot="top-left" />
        <arcgis-expand slot="bottom-left">
          <arcgis-basemap-gallery></arcgis-basemap-gallery>
        </arcgis-expand>
        <arcgis-locate
          slot="bottom-right"
          style={{
            display: "block",
            marginBottom: "70px",
            marginRight: "-42px",
          }}
        ></arcgis-locate>
        {/*  A Feature Layer in the Web Map has an associated chart (layer-item-id) */}
        {/* <arcgis-chart
          layer-item-id="b1717962dab247ad93eaca257b32fe02"
          chart-index="1"
          slot="bottom-right"
        ></arcgis-chart> */}
      </arcgis-map>
    </calcite-shell>
  );
}
