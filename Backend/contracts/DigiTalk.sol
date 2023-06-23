// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DigiTalk {
    string public name;
    uint postCount;
    uint transactionCount;

    constructor() {
        name = "DigiTalk";
        postCount = 0;
        transactionCount = 0;
    }

    event Post(
        uint id,
        string userId,
        uint tipAmount,
        string description,
        string hash,
        string fileName,
        string status,
        string extension,
        address payable auther
    );
    event Tiptransaction(
        address sender,
        address payable receiver,
        uint tipAmount,
        uint256 timestamp
    );

    struct TiptransactionStruct {
        address sender;
        address payable receiver;
        uint tipAmount;
        uint256 timestamp;
    }

    struct PostStruct {
        uint id;
        string userId;
        uint tipAmount;
        string description;
        string hash;
        string fileName;
        string status;
        string extension;
        address payable auther;
    }

    // posts array

    PostStruct[] posts;

    TiptransactionStruct[] tiptransactions;

    // Create post method

    function createPost(
        string memory _description,
        string memory _status,
        string memory hash,
        string memory file_name,
        string memory _userId,
        string memory _extension
    ) public {
        postCount++;

        // add item in post array

        posts.push(
            PostStruct(
                postCount,
                _userId,
                0,
                _description,
                hash,
                file_name,
                _status,
                _extension,
                payable(msg.sender)
            )
        );

        // emit function

        emit Post(
            postCount,
            _userId,
            0,
            _description,
            hash,
            file_name,
            _status,
            _extension,
            payable(msg.sender)
        );
    }

    // get all posts

    function getAllPosts() public view returns (PostStruct[] memory) {
        return posts;
    }

    // get post count

    function getPostsCount() public view returns (uint) {
        return postCount;
    }

    function getPostsByAddress(
        address _requireAddress
    ) public view returns (PostStruct[] memory) {
        DigiTalk.PostStruct[] memory postArr = new DigiTalk.PostStruct[](
            posts.length
        );
        uint j = 0;
        for (uint i = 0; i < postCount; i++) {
            if (posts[i].auther == _requireAddress) {
                postArr[j] = posts[i];
            }
            j += 1;
        }

        return postArr;
    }

    function getPostsByExtension(
        string memory _extension
    ) public view returns (PostStruct[] memory) {
        DigiTalk.PostStruct[] memory postArr = new DigiTalk.PostStruct[](
            posts.length
        );
        uint j = 0;
        for (uint i = 0; i < postCount; i++) {
            // string memory Extension=posts[i].extension;
            if (
                keccak256(bytes(posts[i].extension)) ==
                keccak256(bytes(_extension))
            ) {
                postArr[j] = posts[i];
            }
            j += 1;
        }

        return postArr;
    }

    function tipOwner(uint _id, uint amount) public {
        require(_id >= 0 && _id <= postCount, "Id is not correct");
        transactionCount += 1;

        PostStruct memory _post = posts[_id];

        _post.tipAmount = _post.tipAmount + amount;

        posts[_id] = _post;

        tiptransactions.push(
            TiptransactionStruct(
                msg.sender,
                payable(_post.auther),
                amount,
                block.timestamp
            )
        );

        emit Tiptransaction(
            msg.sender,
            payable(posts[_id].auther),
            amount,
            block.timestamp
        );
    }

    function getAlltipTransactions()
        public
        view
        returns (TiptransactionStruct[] memory)
    {
        return tiptransactions;
    }

    function gettipTransactionsCount() public view returns (uint) {
        return transactionCount;
    }
}

// contract DigiTalk {
//     string public name;
//     uint postCount;

//     constructor() {
//         name = "DigiTalk";
//         postCount = 0;
//     }

//     event Post(
//         uint id,
//         uint tipAmount,
//         string description,
//         string hash,
//         string fileName,
//         address payable auther
//     );

//     struct PostStruct {
//         uint id;
//         uint tipAmount;
//         string description;
//         string hash;
//         string fileName;
//         address payable auther;
//     }

//     // posts array

//     PostStruct[] posts;

//     // Create post method

//     function createPost(
//         string memory _description,
//         string memory hash,
//         string memory file_name
//     ) public {
//         postCount++;

//         // add item in post array

//         posts.push(
//             PostStruct(
//                 postCount,
//                 0,
//                 _description,
//                 hash,
//                 file_name,
//                 payable(msg.sender)
//             )
//         );

//         // emit function

//         emit Post(
//             postCount,
//             0,
//             _description,
//             hash,
//             file_name,
//             payable(msg.sender)
//         );
//     }

//     // get all posts

//     function getAllPosts() public view returns (PostStruct[] memory) {
//         return posts;
//     }

//     // get post count

//     function getPostsCount() public view returns (uint) {
//         return postCount;
//     }

//     function tipOwner(uint _id) public payable {
//         // require(msg.value>0.0001 ether);

//         PostStruct memory _post = posts[_id];

//         address payable _auther = _post.auther;

//         payable(address(_auther)).transfer(msg.value);

//         _post.tipAmount = _post.tipAmount + msg.value;

//         posts[_id] = _post;
//     }
// }
