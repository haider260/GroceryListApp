import XCTest

final class Smoke: XCTestCase {
  func testShoppingFlow() {
    continueAfterFailure = false
    let listName = "Smoke " + String(UUID().uuidString.prefix(8))
    let app = XCUIApplication(bundleIdentifier: "org.reactjs.native.example.GroceryListApp")
    app.launch()
    let create = app.buttons["Create grocery list"]
    XCTAssertTrue(create.waitForExistence(timeout: 15))
    create.tap()
    let name = app.textFields["List name"]
    XCTAssertTrue(name.waitForExistence(timeout: 5))
    name.tap()
    for character in listName { name.typeText(String(character)) }
    XCTAssertEqual(name.value as? String, listName)
    app.buttons["Create list"].tap()
    XCTAssertTrue(app.buttons["Add item"].waitForExistence(timeout: 5))
    app.buttons["Add item"].tap()
    let item = app.textFields["Item name"]
    XCTAssertTrue(item.waitForExistence(timeout: 5))
    item.tap()
    for character in "Bananas" { item.typeText(String(character)) }
    app.swipeUp()
    let addButton = app.buttons.matching(identifier: "Add item").allElementsBoundByIndex.first(
      where: { $0.isHittable })!
    addButton.tap()
    let check = app.descendants(matching: .any).matching(identifier: "Mark Bananas purchased")
      .firstMatch
    XCTAssertTrue(check.waitForExistence(timeout: 5))
    check.tap()
    let checked = app.descendants(matching: .any).matching(identifier: "Mark Bananas pending")
      .firstMatch
    XCTAssertTrue(checked.waitForExistence(timeout: 5))
    let attachment = XCTAttachment(screenshot: app.screenshot())
    attachment.name = "Grocery list"
    attachment.lifetime = .keepAlways
    add(attachment)
    app.terminate()
    app.launch()
    let card = app.buttons["\(listName), 1 of 1 purchased"]
    XCTAssertTrue(card.waitForExistence(timeout: 10))
    card.tap()
    XCTAssertTrue(
      app.descendants(matching: .any).matching(identifier: "Mark Bananas pending").firstMatch
        .waitForExistence(timeout: 5))
    app.buttons["List options"].tap()
    app.alerts.buttons["Delete list"].tap()
    let confirmDelete = app.alerts.buttons["Delete"]
    XCTAssertTrue(confirmDelete.waitForExistence(timeout: 5))
    confirmDelete.tap()
    XCTAssertTrue(app.buttons["Create grocery list"].waitForExistence(timeout: 5))
    XCTAssertFalse(card.exists)
    app.terminate()
    app.launch()
    XCTAssertTrue(app.buttons["Create grocery list"].waitForExistence(timeout: 10))
    XCTAssertFalse(card.exists)
  }
}
