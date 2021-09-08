# Launch Darkly Checkout Example
This example shows how to use a Launch Darkly feature flag to rollout a new PayPal purchase option on a checkout page, using Express.js and Launch Darkly's [Node SDK](https://docs.launchdarkly.com/sdk/server-side/node-js).

By putting the new purchase option behind a feature flag we can:

* Release the new payment option at the time of our choosing
* Deploy to subset of our visitors to mitigate risk
* Quickly roll back the new payment option in the event of a problem, minimizing revenue loss
* Experiment with the new payment option to see if there is an impact on conversion rate and revenue

## Installation
1. Run `npm install`
2. Open the `.env` file in the project root and set `LAUNCH_DARKLY_SDK_KEY = ` to your SDK key
1. To launch the demo site run `npm start` and point your browser to [`http://localhost:3000`](https://localhost:3000))

## Feature Flag Setup
Create a simple boolean feature flag. When this flag is enabled the PayPal checkout option will be enabled.

1. Create a new feature flag in Launch Darkly with a key name of `paypal-checkout`
2. Set the flag variations type to Boolean
3. Set Variation 1 to `true` and Variation 2 to `false`

## Running the Demo

### Step 1: Basic Toggle

1. Ensure the flag is set to off
2. Launch the site and observe that the option to checkout with a credit/debit card is shown
2. Toggle the feature flag on and reload the site. The checkout option should chane to a PayPal widget experience.

Launch Darkly delivers changes to flag states near instantaneously. By changing the flag and refreshing the page we can enable the new experience at will.


### Step 2: Targeted Toggle

Our logged in users save their credit card information for faster checkout, we don't want to expose them to the PayPal option and disrupt their experience. 
1. Open the settings for your flag and go to Targeting
2. Create a rule under Target users who match these rules:
    * Name this rule 'Logged in users'
    * Select the condtions to `loggedin` - `is one of` - `true`
    * Set the flag to off for this rule
3. Reload the page

Observe that the default checkout experience has returned despite the feature flag being turned on. The rule we created exclused users who have `loggedin: true` in their user context. We can see in app.js that our dummy user has the attribute set to true.


## Implementation
*Comments begin with 'LD Demo'*

`app.js`

* Imports and initializes the SDk
* Creates a fake dummy user object
* Implements a middleware function named `getLDFlags` that retrieves the state of all flags using `client.allFlagsState` and passes them to routers as local variables
* Defines a function named `trackLDEvent` that can be referenced by routers to track conversion events on pageviews for future AB tests.

`routes/index.js`

* Reads the flag state from local variables and passes to view template as a parameter

`views/index.ejs`
* Checks the flag to see which checkout component to render

`routes/confirm.js`
* Invokes `trackLDEvent` which triggers `client.track` to send a converstion event for AB testing measurement.
