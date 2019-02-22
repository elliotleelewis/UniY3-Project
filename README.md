# UniY3-Project

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://raw.githubusercontent.com/elliotleelewis/UniY3-Project/master/LICENSE)
[![Build Status](https://travis-ci.com/elliotleelewis/UniY3-Project.svg?branch=master)](https://travis-ci.com/elliotleelewis/UniY3-Project)

## How to View Deployed Application

### Prerequisites

- Mozilla Firefox

### Steps

- Visit [http://uniy3-project.elliotlewis.io](http://uniy3-project.elliotlewis.io) in Mozilla Firefox (when viewing the deployed application, it is imperative that you use Mozilla Firefox, due to security protocols on Google Chrome).

## How to Run Application Locally

### Prerequisites

- Mozilla Firefox or Google Chrome
- [.NET Core SDK (Version 2.2)](https://dotnet.microsoft.com/download/dotnet-core/2.2)
- [NodeJS (Version 10, LTS)](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/lang/en/)
- [MongoDB (Community Edition)](https://www.mongodb.com/download-center/community?jmp=docs)

### Steps

- Run `mongod` at command line to start MongoDB.
- In a new command line window, `cd` into the project folder.
- Run `dotnet restore`.
- Run `dotnet run`.
- Open up [http://localhost:5000](http://localhost:5000) in either Mozilla Firefox, or Google Chrome.

## How to Use Application

### Prerequisites

- Webcam

### Steps

- To view any given deformation, just click on the link to it on the homepage of the application. Ensure the lighting in the room that you are in is good, and then wait for the application to find your face in the webcam. Ensure you click "Allow" when the application requests to use your webcam.
- To create a deformation, click the "Create" button at the top of the page. Then play with the sliders on the right side of the screen. Beware that creating a deformation requires you to be logged in.
- To log in/register, click the "Login" or "Register" buttons in the top right of the page and complete the forms.
