import argparse
import sys

from github import Github

def parse_args():
    parser = argparse.ArgumentParser(description="Tag a release in GitHub")
    parser.add_argument("token", help="GitHub Token")
    parser.add_argument("version", help="Version")
    parser.add_argument("commit", help="Commit Hash")
    parser.add_argument("tag_slug", help="Tag Slug")
    parser.add_argument("tag_name", help="Tag Name")
    args = parser.parse_args()
    return args

def main():
    args = parse_args()
    g = Github(args.token)
    repo = g.get_repo("pangeacyber/pangea-javascript")

    tag = f"{args.tag_slug}-v{args.version}"
    tag_message = f"{args.tag_name} v{args.version}"
    release = tag
    release_message = tag_message
    object = args.commit
    type = "commit"

    print(f"Tag version: {tag}")
    if args.version.find('beta'):
        
        repo.create_git_tag(
            tag,
            tag_message,
            object,
            type
        )
    else:
        print(f"Create release: {tag_message}")
        repo.create_git_tag_and_release(
            tag,
            tag_message,
            release,
            release_message,
            object,
            type
        )
    

if __name__ == "__main__":
    main()
