A session tracker that automatically keeps track of page loads for both SPAs and traditional websites. Built with TypeScript. Uses Rollup for bundling.

## Initializing

1. Include the sdk into your webpage via script tag or npm package
2. Initialize it with your property ID

```
if (window.insticator) {
  insticator.init('ABC') 
  // Replace ABC with your property ID. Attributes future events etc to this account
}
```

## The session instance

The session isntance has been named `insticator` which can be configured to anything else. It is present in the window object

## Tracking Events

Events can be tracked using:
```
insticator.pushEvent(eventName, eventProperties)
```
`eventProperties` being optional

## Getting the session object
The session details can be obtained via the session instance
```
insticator.getSession()
```

## Demo

This project is also hosted at [https://victorfdes.github.io/session-tracker-poc/](https://victorfdes.github.io/session-tracker-poc/)

The Demo site uses the dev version of the code and includes sourcemaps for easy debugging.

## Limitations

1. The session object uses cookies which can be read/written by 3rd party code too.
2. The cookies add an additional overhead to server requests

## Testing
The project is configured with Jest for unit tests. 
Additional coverage is needed to make this production ready.

For E2E testing we could run this in a puppeteer instance and simulate user behavior. The session results can be validated against expected results.
