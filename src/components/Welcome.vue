<template>
    <div class="comments">
      <h3 class="title">评论区</h3>
      <el-form :model="commentForm" label-width="80px" class="comment-form">
        <el-form-item label="姓名">
          <el-input v-model="commentForm.name" placeholder="请输入您的姓名"></el-input>
        </el-form-item>
        <el-form-item label="评论">
          <el-input v-model="commentForm.comment" type="textarea" :rows="4" placeholder="请输入您的评论"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addComment">发布评论</el-button>
        </el-form-item>
      </el-form>
      <div class="comment-list">
        <div v-if="comments.length === 0" class="no-comment">暂无评论，快来发表你的看法吧！</div>
        <div v-for="(comment, index) in comments" :key="index" class="comment">
          <div class="avatar">
            <el-avatar :size="56" :src="getAvatar(comment.name)"></el-avatar>
          </div>
          <div class="comment-content">
            <div class="name">{{ comment.name }}</div>
            <div class="content">{{ comment.comment }}</div>
            <div class="reply-list">
              <div v-for="(reply, idx) in comment.replies" :key="idx" class="reply">
                <div class="name">{{ reply.name }}</div>
                <div class="content">{{ reply.content }}</div>
              </div>
            </div>
            <div class="reply-form">
              <el-form :model="replyForm" label-width="80px" size="small">
                <el-form-item label="姓名">
                  <el-input v-model="replyForm.name" placeholder="请输入您的姓名"></el-input>
                </el-form-item>
                <el-form-item label="回复">
                  <el-input v-model="replyForm.content" type="textarea" :rows="2" placeholder="请输入您的回复"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addReply(comment)">回复</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        commentForm: {
          name: '',
          comment: ''
        },
        replyForm: {
          name: '',
          content: ''
        },
        comments: [
          {
            name: '张三',
            comment: '这篇文章写得很好！',
            replies: []
          },
          {
            name: '李四',
            comment: '感谢作者分享这么有用的内容。',
            replies: []
          }
        ]
      }
    },
    methods: {
      addComment() {
        const name = this.commentForm.name.trim()
        const comment = this.commentForm.comment.trim()
        if (!name || !comment) {
          this.$message.error('请填写姓名和评论内容')
          return
        }
        this.comments.push({
          name,
          comment,
          replies: []
        })
        this.commentForm.name = ''
        this.commentForm.comment = ''
      },
      addReply(comment) {
        const name = this.replyForm.name.trim()
        const content = this.replyForm.content.trim()
        if (!name || !content) {
          this.$message.error('请填写姓名和回复内容')
          return
        }
        comment.replies.push({
          name,
          content
        })
        this.replyForm.name = ''
        this.replyForm.content = ''
      },
      getAvatar(name) {
        const hash = this.hashString(name)
        return `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`
      }
    }
  }
  </script>
  <style scoped>
  .comments {
    margin: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    padding: 20px;
  }
  .title {
    text-align: center;
    font-size: 28px;
    margin-bottom: 20px;
  }
  .comment-form {
    margin-bottom: 20px;
  }
  .comment-list {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
  }
  .no-comment {
    text-align: center;
    font-size: 20px;
    color: #999;
    margin-top: 20px;
  }
  .comment {
    display: flex;
    margin-bottom: 20px;
  }
  .avatar {
    margin-right: 20px;
  }
  .name {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .content {
    margin-top: 5px;
    font-size: 16px;
    line-height: 1.5;
  }
  </style>
