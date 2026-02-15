import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Type definitions
  public type JobStatus = { #open; #paused; #closed };
  public type CandidateStatus = { #new; #screening; #interviewing; #offered; #placed; #rejected };
  public type InterviewType = { #phone; #video; #inPerson };
  public type InterviewStatus = { #scheduled; #completed; #noShow; #cancelled };
  public type EntityStatus = { #active; #inactive };

  public type JobOpening = {
    id : Nat;
    title : Text;
    clientId : ?Nat;
    location : Text;
    salary : ?Text;
    description : Text;
    requirements : Text;
    status : JobStatus;
    createdAt : Int;
    updatedAt : Int;
  };

  public type Candidate = {
    id : Nat;
    fullName : Text;
    phone : Text;
    email : Text;
    skills : Text;
    notes : Text;
    source : Text;
    status : CandidateStatus;
    jobOpeningId : ?Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  public type Interview = {
    id : Nat;
    candidateId : Nat;
    jobOpeningId : ?Nat;
    interviewDate : Int;
    interviewType : InterviewType;
    interviewerName : Text;
    location : Text;
    status : InterviewStatus;
    outcome : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  public type Client = {
    id : Nat;
    companyName : Text;
    contactPerson : Text;
    phone : Text;
    email : Text;
    address : Text;
    notes : Text;
    status : EntityStatus;
    createdAt : Int;
    updatedAt : Int;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    role : Text;
  };

  // State management
  let accessControlState = AccessControl.initState();
  let jobOpenings = Map.empty<Nat, JobOpening>();
  let candidates = Map.empty<Nat, Candidate>();
  let interviews = Map.empty<Nat, Interview>();
  let clients = Map.empty<Nat, Client>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextJobOpeningId = 1;
  var nextCandidateId = 1;
  var nextInterviewId = 1;
  var nextClientId = 1;

  include MixinAuthorization(accessControlState);

  // Smart comparison modules
  module JobOpening {
    public func compareByUpdatedAt(x : JobOpening, y : JobOpening) : Order.Order {
      Int.compare(x.updatedAt, y.updatedAt);
    };
  };

  module Candidate {
    public func compareByUpdatedAt(x : Candidate, y : Candidate) : Order.Order {
      Int.compare(x.updatedAt, y.updatedAt);
    };
  };

  module Interview {
    public func compareByUpdatedAt(x : Interview, y : Interview) : Order.Order {
      Int.compare(x.updatedAt, y.updatedAt);
    };
  };

  module Client {
    public func compareByUpdatedAt(x : Client, y : Client) : Order.Order {
      Int.compare(x.updatedAt, y.updatedAt);
    };
  };

  // User Profile API
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Job Openings API
  public shared ({ caller }) func createJobOpening(title : Text, clientId : ?Nat, location : Text, salary : ?Text, description : Text, requirements : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can create job openings");
    };
    let id = nextJobOpeningId;
    let now = Time.now();
    let jobOpening : JobOpening = {
      id;
      title;
      clientId;
      location;
      salary;
      description;
      requirements;
      status = #open;
      createdAt = now;
      updatedAt = now;
    };
    jobOpenings.add(id, jobOpening);
    nextJobOpeningId += 1;
    id;
  };

  public query ({ caller }) func getJobOpening(id : Nat) : async JobOpening {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can view job openings");
    };
    switch (jobOpenings.get(id)) {
      case (null) { Runtime.trap("Job opening not found") };
      case (?job) { job };
    };
  };

  public query ({ caller }) func getAllJobOpenings() : async [JobOpening] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can view job openings");
    };
    jobOpenings.values().toArray().sort(JobOpening.compareByUpdatedAt);
  };

  public shared ({ caller }) func updateJobOpening(id : Nat, title : Text, clientId : ?Nat, location : Text, salary : ?Text, description : Text, requirements : Text, status : JobStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can update job openings");
    };
    switch (jobOpenings.get(id)) {
      case (null) { Runtime.trap("Job opening not found") };
      case (?existing) {
        let updatedJob : JobOpening = {
          id;
          title;
          clientId;
          location;
          salary;
          description;
          requirements;
          status;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        jobOpenings.add(id, updatedJob);
      };
    };
  };

  public shared ({ caller }) func deleteJobOpening(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete job openings");
    };
    if (not jobOpenings.containsKey(id)) { Runtime.trap("Job opening not found") };
    jobOpenings.remove(id);
  };

  // Candidate API
  public shared ({ caller }) func createCandidate(fullName : Text, phone : Text, email : Text, skills : Text, notes : Text, source : Text, jobOpeningId : ?Nat) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can create candidates");
    };
    let id = nextCandidateId;
    let now = Time.now();
    let candidate : Candidate = {
      id;
      fullName;
      phone;
      email;
      skills;
      notes;
      source;
      status = #new;
      jobOpeningId;
      createdAt = now;
      updatedAt = now;
    };
    candidates.add(id, candidate);
    nextCandidateId += 1;
    id;
  };

  public query ({ caller }) func getCandidate(id : Nat) : async Candidate {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can view candidates");
    };
    switch (candidates.get(id)) {
      case (null) { Runtime.trap("Candidate not found") };
      case (?candidate) { candidate };
    };
  };

  public query ({ caller }) func getAllCandidates() : async [Candidate] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can view candidates");
    };
    candidates.values().toArray().sort(Candidate.compareByUpdatedAt);
  };

  public shared ({ caller }) func updateCandidate(id : Nat, fullName : Text, phone : Text, email : Text, skills : Text, notes : Text, source : Text, status : CandidateStatus, jobOpeningId : ?Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can update candidates");
    };
    switch (candidates.get(id)) {
      case (null) { Runtime.trap("Candidate not found") };
      case (?existing) {
        let updatedCandidate : Candidate = {
          id;
          fullName;
          phone;
          email;
          skills;
          notes;
          source;
          status;
          jobOpeningId;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        candidates.add(id, updatedCandidate);
      };
    };
  };

  public shared ({ caller }) func deleteCandidate(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete candidates");
    };
    if (not candidates.containsKey(id)) { Runtime.trap("Candidate not found") };
    candidates.remove(id);
  };

  // Interview API
  public shared ({ caller }) func createInterview(candidateId : Nat, jobOpeningId : ?Nat, interviewDate : Int, interviewType : InterviewType, interviewerName : Text, location : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can create interviews");
    };
    let id = nextInterviewId;
    let now = Time.now();
    let interview : Interview = {
      id;
      candidateId;
      jobOpeningId;
      interviewDate;
      interviewType;
      interviewerName;
      location;
      status = #scheduled;
      outcome = "";
      createdAt = now;
      updatedAt = now;
    };
    interviews.add(id, interview);
    nextInterviewId += 1;
    id;
  };

  public query ({ caller }) func getInterview(id : Nat) : async Interview {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can view interviews");
    };
    switch (interviews.get(id)) {
      case (null) { Runtime.trap("Interview not found") };
      case (?interview) { interview };
    };
  };

  public query ({ caller }) func getAllInterviews() : async [Interview] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can view interviews");
    };
    interviews.values().toArray().sort(Interview.compareByUpdatedAt);
  };

  public shared ({ caller }) func updateInterview(id : Nat, candidateId : Nat, jobOpeningId : ?Nat, interviewDate : Int, interviewType : InterviewType, interviewerName : Text, location : Text, status : InterviewStatus, outcome : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can update interviews");
    };
    switch (interviews.get(id)) {
      case (null) { Runtime.trap("Interview not found") };
      case (?existing) {
        let updatedInterview : Interview = {
          id;
          candidateId;
          jobOpeningId;
          interviewDate;
          interviewType;
          interviewerName;
          location;
          status;
          outcome;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        interviews.add(id, updatedInterview);
      };
    };
  };

  public shared ({ caller }) func deleteInterview(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete interviews");
    };
    if (not interviews.containsKey(id)) { Runtime.trap("Interview not found") };
    interviews.remove(id);
  };

  // Client API
  public shared ({ caller }) func createClient(companyName : Text, contactPerson : Text, phone : Text, email : Text, address : Text, notes : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can create clients");
    };
    let id = nextClientId;
    let now = Time.now();
    let client : Client = {
      id;
      companyName;
      contactPerson;
      phone;
      email;
      address;
      notes;
      status = #active;
      createdAt = now;
      updatedAt = now;
    };
    clients.add(id, client);
    nextClientId += 1;
    id;
  };

  public query ({ caller }) func getClient(id : Nat) : async Client {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can view clients");
    };
    switch (clients.get(id)) {
      case (null) { Runtime.trap("Client not found") };
      case (?client) { client };
    };
  };

  public query ({ caller }) func getAllClients() : async [Client] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can view clients");
    };
    clients.values().toArray().sort(Client.compareByUpdatedAt);
  };

  public shared ({ caller }) func updateClient(id : Nat, companyName : Text, contactPerson : Text, phone : Text, email : Text, address : Text, notes : Text, status : EntityStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only staff can update clients");
    };
    switch (clients.get(id)) {
      case (null) { Runtime.trap("Client not found") };
      case (?existing) {
        let updatedClient : Client = {
          id;
          companyName;
          contactPerson;
          phone;
          email;
          address;
          notes;
          status;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        clients.add(id, updatedClient);
      };
    };
  };

  public shared ({ caller }) func deleteClient(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete clients");
    };
    if (not clients.containsKey(id)) { Runtime.trap("Client not found") };
    clients.remove(id);
  };
};
