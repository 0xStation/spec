import {
  LiveObject,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
} from "@spec.dev/core"

/**
 * A TokenOperator on Station.
 */
@Spec({
  uniqueBy: ["chainId", "contractAddress", "accountAddress", "operation"],
})
class Permission extends LiveObject {
  // The membership contract.
  @Property()
  contractAddress: Address

  // The address that has the given permission.
  @Property()
  accountAddress: Address

  // The permissions of the token operator.
  @Property()
  operation: string

  // If the permission is active or not.
  // If the permission is not active, it means it has most recently been removed.
  @Property()
  active: boolean

  // ==== Event Handlers ===================
  @OnEvent("station.Membership.PermissionAdded")
  onPermissionAdded(event: Event) {
    this.contractAddress = event.origin.contractAddress
    this.accountAddress = event.data.account
    this.operation = event.data.operation
    this.active = true
  }

  @OnEvent("station.Membership.PermissionRemoved")
  onPermissionRemoved(event: Event) {
    this.contractAddress = event.origin.contractAddress
    this.accountAddress = event.data.account
    this.operation = event.data.operation
    this.active = false
  }
}

export default Permission
