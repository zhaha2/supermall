import {TOP_DISTANCE} from "./const";
import BackTop from 'components/content/backTop/BackTop'
import {POP, NEW, SELL} from "./const";

// 混入：提取公共代码，将mixin中的代码混入到调用他的组件中。免得重复代码太多

export const backTopMixin = {
	components: {
		BackTop
	},
	data() {
		return {
			isShowBackTop: false
		}
	},
	methods: {
		backClick() {
			this.$refs.scroll.scrollTo(0, 0, 300)
		},
		listenBackTop(position) {
			this.isShowBackTop = (-position.y) > 1000
		}
	}
}

export const tabControlMixin = {
	data: function () {
		return {
			currentType: POP
		}
	},
	methods: {
		tabClick(index) {
			switch (index) {
				case 0:
					this.currentType = POP
					break
				case 1:
					this.currentType = NEW
					break
				case 2:
					this.currentType = SELL
					break
			}
			console.log(this.currentType);
		}
	}
}