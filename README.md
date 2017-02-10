# Synopsis
This codebase simulates a twitter like feed based on the input of two files i.e. ``` user.txt and tweet.txt ```

#Prerequesites
You will need Node.js to run this application, you can download it [here] (https://nodejs.org/en/download/).

#Installation

Run ``` npm install ``` to download required node packages

#Usage

Run ``` node index.js --users=user.txt --tweets=tweet.txt ```

##Output

``` 
Alan
	@Alan: If you have a procedure with 10 parameters, you probably missed some.

	@Alan: Random numbers should not be generated with a method chosen at random.


Martin

Ward
	@Alan: If you have a procedure with 10 parameters, you probably missed some.

	@Ward: There are only two hard things in Computer Science: cache invalidation, naming things and off-by-1 errors.

	@Alan: Random numbers should not be generated with a method chosen at random.
```

#Test

Run ``` npm test ```

#Continous Integration

To run in a jenkins job which runs tests first then exection after checkin add the following:

Run ```npm test && node index.js --users=user.txt --tweets=tweet.txt```

#Docs

Run ``` npm run generate-docs ```

Navigate to ```out``` directory in rootFolder and open ```index.html``` to see generated documentation 

#Licence
ISC