# apiKeyCallback

**Parameters**

-   `event` **Object** 
-   `key` **String** API Key String

# BrowserConsole

Creates a new Transport that handles sending log data to console.log or
console.error so that the information is displayed to the BrowserConsole if
the current process is the renderer process.

**Parameters**

-   `opts` **[Object]** Transport Options
    -   `opts.name` **[String]** Logger name (optional, default `BrowserConsole`)
    -   `opts.level` **[String]** Log level to start recording at (optional, default `info`)

# transports

Custom Winston Transports Module

## createYappy

Creates a Yappy Client and initializes the data, specifically user and device
data for later use.

**Parameters**

-   `apiKey` **String** Yappy API Key for specific user
-   `cb` **yappyCallback** Callback that takes (error, yappyClient)

# IpcCommunicator

Convenience object for handling Inter-Process Communication using predetermined
protocols. Primarily useful on the Renderer process.

**Parameters**

-   `key`  
-   `url`  
-   `noDebug`  

## doApiKeyPass

Does an API Key Pass handled by the main process

**Parameters**

-   `key` **String** API Key
-   `url` **String** URL relative to root directory to load and re-pass API key
-   `noDebug` **[Boolean]** If Debug is On this forces Debug Options ot not run [Optional, Defualt=false]

## doCloseMainWindow

Fires an event that casues the application to completely quit

## receiveApiKey

Receive API Key after calling `doApiKeyPass`.

**Parameters**

-   `callback` **apiKeyCallback** Callback that receives the API Key

# getUserHome

Retrieves the home directory of the current user from the process environment
variables. On unix-like systems this is likely to be /home/<username>, on
Windows systems this will likely be C:\Users\<Username>.

Returns **String** Home directory of the current user

# ifDebug

Runs the given function in the given context if and only if isDebug
returns true. Any arguments after the first two are passed to the given
function as arguments.

**Parameters**

-   `func` **Function** Function to call if debug is on
-   `ctxt` **Object** Context in which to execute the function. Determines 'this'

# isDebug

Returns **Boolean** true if the DEBUG environment variable is set, false otherwise

# isRenderer

Returns **Boolean** true if in renderer process, false otherwise (in main process for example)

# YappyClient

YappyClient constructor, requires an API Key. This constructor does little on it's
own, see createYappy

Is not public. Use createYappy.

**Parameters**

-   `apiKey` **String** Yappy API key for specific user

## makeGet

Make a GET request to the given URL wit hthe specific parameters. When a
reponse is received it is passed to the given callback.

**Parameters**

-   `url` **String** URL to make request to
-   `parameters` **Object** Enumeration of GET params
-   `callback` **Function** Callback once request returns, takes response object

## makePost

Makes a POST request to the given URL with the specified headers and
parameters. When a response is received it is passed to the given callback.

**Parameters**

-   `url` **String** URL to make request to
-   `headers` **Object** POST Header Enumeration
-   `parameters` **Object** Enumeration of POST params
-   `callback` **Function** Callback once request returns, takes response object

# openInExternalBrowser

Attempts to open the given URL in the default external browser for the
current User.

**Parameters**

-   `url` **String** Web URL

# retrieveDevices

Retrieves device details for yappy client

**Parameters**

-   `callback` **retrieveDevicesCallback** 

# retrieveDevicesCallback

**Parameters**

-   `err` **Error or Null** The Error that Occurred or Null
-   `devices` **Array&lt;Object&gt;** Array of Device Objects tied to User

# retrieveUser

Retrieves user details for yappy Client

**Parameters**

-   `callback` **retrieveUserCallback** 

# retrieveUserCallback

**Parameters**

-   `err` **Error or Null** The Error that Occurred or Null
-   `user` **Object** User Object
    -   `user.name` **String** User name
    -   `user.email` **String** User email
    -   `user.avatar` **String** URL Location of User's Avatar Image

# toArray

Converts the given sequential object to an array starting at the element
at the given index. Typically this is used for variable arguments using the
supplied Arguments object as the first parameter.

**Parameters**

-   `args` **Object** Sequential Object (Usually arguments)
-   `index` **Number** starting index

Returns **Array** Array of elements from sequential object

# utility

Utility Module

# yappy

Yappy Client Module

# yappyCallback

**Parameters**

-   `yappy` **YappyClient** Yappy Client Object with Initialized Data
