# Service \_\_skeleton

Template for service packages under `packages/services/*`.

Service factories in copied packages return a domain-named service key and
derive the exported service type from that factory return. Non-empty service
factories accept a typed service context from `./types` and wrap feature
functions that receive `ctx` and `props`.
