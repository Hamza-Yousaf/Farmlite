declare module 'leaflet-draw' {
  import * as L from 'leaflet'

  namespace L {
    namespace Draw {
      interface DrawOptions {
        draw?: DrawOptions.DrawOptions
        edit?: DrawOptions.EditOptions
      }

      namespace DrawOptions {
        interface DrawOptions {
          polygon?: PolygonOptions
          rectangle?: RectangleOptions
          circle?: boolean | CircleOptions
          circlemarker?: boolean | CircleMarkerOptions
          polyline?: boolean | PolylineOptions
          marker?: boolean | MarkerOptions
        }

        interface EditOptions {
          featureGroup: L.FeatureGroup
          remove?: boolean
        }

        interface PolygonOptions {
          allowIntersection?: boolean
          showArea?: boolean
        }

        interface RectangleOptions {
          showArea?: boolean
        }

        interface CircleOptions {
          showRadius?: boolean
        }

        interface CircleMarkerOptions {
          showRadius?: boolean
        }

        interface PolylineOptions {
          showLength?: boolean
        }

        interface MarkerOptions {
          icon?: L.Icon | L.DivIcon
        }
      }

      class Draw extends L.Control {
        constructor(options?: DrawOptions)
        options: DrawOptions
      }

      namespace Event {
        const CREATED: string
        const EDITED: string
        const DELETED: string
        const DRAWSTART: string
        const DRAWSTOP: string
        const DRAWVERTEX: string
        const EDITSTART: string
        const EDITMOVE: string
        const EDITRESIZE: string
        const EDITVERTEX: string
        const EDITSTOP: string
        const DELETESTART: string
        const DELETESTOP: string
      }

      namespace DrawEvents {
        interface Created extends L.LeafletEvent {
          layer: L.Layer
          layerType: string
        }

        interface Edited extends L.LeafletEvent {
          layers: L.LayerGroup
        }

        interface Deleted extends L.LeafletEvent {
          layers: L.LayerGroup
        }
      }
    }
  }

  export = L
}

