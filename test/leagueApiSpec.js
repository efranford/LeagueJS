/*global describe*/
/*global require*/
/*global beforeEach*/
/*global it*/
/*global xit*/

describe('League of Legends api wrapper test suite', function () {
    'use strict';


    var sinon = require('sinon'),
        should = require('should'),
        leagueApi = require('../lib/lolapi'),
        mockChampionArray = ['Teemo', 'Ahri', 'Vladimir'],
        mockSummonersArray = [29228901, 19199530],
        mockMatchArray = [1622420185, 1622447158];


    beforeEach(function () {
        leagueApi.init('your api key here', 'na');
    });

    it('should be able to retrieve all champions', function (done) {

        leagueApi.getChampions(false, 'na', function (err, res) {
            should.not.exist(err);
            should.exist(res);
            res.length.should.be.greaterThan(0);
            done();
        });
    });

    it('should be able to retrieve all of the free champions', function (done) {
        leagueApi.getChampions(true, 'na', function (err, res) {
            should.not.exist(err);
            should.exist(res);
            res.length.should.be.equal(10);
            done();
        });
    });

    it('should throw an error if given the wrong type ', function (done) {
        done();
    });

    it('should be able to get summoners data from a list of ids', function (done) {
        leagueApi.Summoner.listSummonerDataByIDs(mockSummonersArray, function (err, res) {
            should.not.exist(err);
            should.exist(res);
            mockSummonersArray.forEach(function (id) {
                should.exist(res[id]);
            });
            done();
        });
    });

    it('should be able to get champion static data', function(done) {
        var options = {champData: 'allytips,blurb', version : '4.4.3', locale: 'en_US'};
        leagueApi.Static.getChampionList(options, 'na', function(err, champs) {
            should.not.exist(err);
            should.exist(champs);
            done();
        });
    });

    it('should be able to get a list of versions', function(done) {
        leagueApi.Static.getVersions('na', function(err, vers) {
            should.not.exist(err);
            should.exist(vers);
            done();
        });
    });

    it('should be able to get static data of a champion by id', function(done) {
        var options = {champData: 'allytips,blurb', version : '4.4.3', locale: 'en_US'};
        leagueApi.Static.getChampionById(1, options, 'na', function(err, champ) {
            should.not.exist(err);
            should.exist(champ);
            done();
        });
    });

    it('should be able to get a list of items', function(done) {
        var options = {champData: 'allytips,blurb', version : '4.4.3', locale: 'en_US'};
        leagueApi.Static.getItemList(options, 'na', function(err, items) {
            should.not.exist(err);
            should.exist(items);
            done();
        });
    });

    it('should be able to get static data of an item by id', function(done) {
        var options = {champData: 'allytips,blurb', version : '4.4.3', locale: 'en_US'};
        leagueApi.Static.getItemById(2009, options, 'na', function(err, item) {
            should.not.exist(err);
            should.exist(item);
            done();
        });
    });

    it('should be able to get static data of masteries', function(done) {
        var options = {masteryListData: 'prereq', version : '4.4.3', locale: 'en_US'};
        leagueApi.Static.getMasteryList(options, 'na', function (err, masteries) {
            should.not.exist(err);
            should.exist(masteries);
            done();
        });
    });

    it('should be able to get static data of a mastery by id', function(done) {
        var options = {masteryData: 'prereq', version : '4.4.3', locale: 'en_US'};
        leagueApi.Static.getMasteryById(4353, options, 'na', function (err, mastery) {
            should.not.exist(err);
            should.exist(mastery);
            done();
        });
    });

    it('should be able to get static data of a realm', function(done) {
        leagueApi.Static.getRealm('na', function (err, realm) {
            should.not.exist(err);
            should.exist(realm);
            done();
        });
    });


    it('should be able to get match', function(done) {
        leagueApi.getMatch(mockMatchArray[0], false, function(err, match) {
            should.not.exist(err);
            should.exist(match);
            done();
        });
    });
    it('should be able to get match with timeline', function(done) {
        leagueApi.getMatch(mockMatchArray[0], true, function(err, match) {
            should.not.exist(err);
            should.exist(match);
            should.exist(match.timeline);
            done();
        });
    });
    it('should be able to get match history', function(done) {
        leagueApi.getMatchHistory(mockSummonersArray[0], null, function(err, match) {
            should.not.exist(err);
            should.exist(match);
            done();
        });
    });
    it('should be able to get match history with options', function(done) {
        var options = {
            championIds : [5,10,9,1,35],
            rankedQueues : ['RANKED_SOLO_5x5', 'RANKED_TEAM_3x3'],
            beginIndex : 1,
            endIndex : 5
        };
        leagueApi.getMatchHistory(mockSummonersArray[0], options, function(err, match) {
            should.not.exist(err);
            should.exist(match);
            done();
        });
    });

    it('should not be able to get current game', function(done) {
        leagueApi.getCurrentGame(mockSummonersArray[0], function(err, game) {
            should.exist(err);
            should.not.exist(game);
            done();
        });
    });

    it('should not be able to get featured games', function(done) {
        leagueApi.getFeaturedGames('na', function(err, games) {
            should.exist(games);
            should.not.exist(err);
            done();
        });
    });

    it('should be able to get a new endpoint', function(done) {

        var currentEndpoint = leagueApi.getEndpoint(),
            newEndpointUrl  = 'https://eu.api.pvp.net/api/lol',
            newEndpoint;
        should(currentEndpoint).equal('api.pvp.net/api/lol');

        leagueApi.setEndpoint(newEndpointUrl);
        newEndpoint = leagueApi.getEndpoint();
        should(newEndpoint).equal(newEndpointUrl);

        done();

    });

    it('should be able to get shards', function(done) {
        leagueApi.getShards(function(err, shards) {
            should.not.exist(err);
            should.exist(shards);
            done();
        });
    });

    it('should be able to get shards by region', function(done) {
        leagueApi.getShardByRegion('na', function(err, shards) {
            should.not.exist(err);
            should.exist(shards);
            done();
        });
    });
});
